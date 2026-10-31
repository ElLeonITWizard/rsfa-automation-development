// RSFA — Client Profile related-assets rename planner (candidate, NOT deployed).
//
// Body of the Make "Code" module (code:ExecuteCode, JavaScript) in candidate scenario
// "M.com: Related Assets Renaming after Client Profile Rename (Nov 2026)".
// The same file is loaded by tests/rename-planner.test.js (Node), so the logic Make runs is the logic tested.
//
// Make provides `input` and uses the top-level `return` value as the module output (`{{N.result.*}}`).
// Inputs (mapped in the module):
//   profile     Monday GraphQL `data` of the Client Profile read (module 4): { items: [ ... ] }  (object or JSON text)
//   assets      Monday GraphQL `data` of the related-assets read (module 5)                       (object or JSON text)
//   eventItemId the Client Profile item ID from the webhook (text)
//   maxRenames  optional safety cap (default 150): above it nothing is renamed and an alert is raised
// Output:
//   { ok, abort, renames: [{boardId, itemId, newName, rule}], skipped: [{boardId, itemId, reason}],
//     unchanged, truncated: [alias], counts }
// Names are client personal data: this module never logs them; skipped[] carries IDs and reason codes only.

const CLIENT_PROFILES_BOARD = '5024661649';
const MAX_NAME_LENGTH = 255; // Monday item-name limit

// One entry per GraphQL alias in the related-assets query (make/queries/related-assets.graphql).
// rule:
//   cp        item name = Client Profile name; the link column must hold exactly this one profile
//   borrowers item name = Borrowers display_value with "," replaced by " &"  (same as 1228763 / 1232945; the
//             board-relation `text` field is null in the API, display_value keeps the link order)
//   owners    item name = Policy Owner names joined " & " (+ " | " + provider when set)  (same as 1215342)
//   contact   item name = the single linked Contact's name  (same as 9447215 / Aircall scenarios)
const SPECS = {
  leads:               { boardId: '2074688480', rule: 'cp' },
  mortgageApp:         { boardId: '5025483251', rule: 'cp' },
  sopMasterboard:      { boardId: '5026186805', rule: 'cp' },
  kiwisaverPipeline:   { boardId: '5025201954', rule: 'cp' },
  kiwisaverPipelineLegacy: { boardId: '5025201954', rule: 'cp' },
  existingKiwisaver:   { boardId: '5024672484', rule: 'cp' },
  mortgagePipeline:    { boardId: '5025201889', rule: 'borrowers' },
  existingMortgages:   { boardId: '5024672364', rule: 'borrowers' },
  insurancePipelineByProfile: { boardId: '5025201920', rule: 'owners' },
  insurancePipelineByOwner:   { boardId: '5025201920', rule: 'owners' },
  existingInsuranceByProfile: { boardId: '5024672437', rule: 'owners' },
  existingInsuranceByOwner:   { boardId: '5024672437', rule: 'owners' },
  insuranceQuestionnaire: { boardId: '5025365501', rule: 'contact' },
  kiwisaverQuestionnaire: { boardId: '5026459551', rule: 'contact' },
  aircall:             { boardId: '5026308494', rule: 'contact', skipWhenRevert: true },
};

function parse(value, name) {
  if (value === undefined || value === null || value === '') throw new Error(`missing input: ${name}`);
  return typeof value === 'string' ? JSON.parse(value) : value;
}

function first(list) { return Array.isArray(list) && list.length ? list[0] : null; }
function ids(rel) { return rel && Array.isArray(rel.linked_item_ids) ? rel.linked_item_ids.map(String) : []; }
function clean(s) { return typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : ''; }

function itemsOf(assets, alias) {
  const board = first(assets[alias]);
  const page = board && board.items_page;
  return { items: (page && page.items) || [], truncated: !!(page && page.cursor) };
}

function target(spec, item, ctx) {
  switch (spec.rule) {
    case 'cp': {
      const linked = ids(first(item.link));
      if (linked.length !== 1 || linked[0] !== ctx.profileId) return { skip: 'LINKED_TO_OTHER_OR_MULTIPLE_PROFILES' };
      return { name: ctx.profileName };
    }
    case 'borrowers': {
      const text = clean((first(item.people) || {}).display_value);
      if (!text) return { skip: 'NO_BORROWERS' };
      return { name: clean(text.replace(/,/g, ' &')) };
    }
    case 'owners': {
      const rel = first(item.people) || {};
      const order = ids(rel);
      if (!order.length) return { skip: 'NO_POLICY_OWNERS' };
      const byId = {};
      for (const li of rel.linked_items || []) byId[String(li.id)] = clean(li.name);
      const names = order.map((id) => byId[id]);
      if (names.some((n) => !n)) return { skip: 'OWNER_NAME_UNAVAILABLE' };
      const provider = clean((first(item.provider) || {}).text);
      return { name: names.join(' & ') + (provider ? ' | ' + provider : '') };
    }
    case 'contact': {
      const rel = first(item.link) || {};
      const linked = ids(rel);
      if (linked.length !== 1) return { skip: 'NOT_EXACTLY_ONE_CONTACT' };
      if (!ctx.contactIds.has(linked[0])) return { skip: 'CONTACT_NOT_IN_PROFILE' };
      // 'Revert' = M.com: Revert Contact Creation from Aircall to Monday (10010457) is undoing this link: leave it alone.
      if (spec.skipWhenRevert && clean((first(item.contactStatus) || {}).text) === 'Revert') return { skip: 'AIRCALL_REVERT_IN_PROGRESS' };
      const li = (rel.linked_items || []).find((x) => String(x.id) === linked[0]);
      const name = li && clean(li.name);
      if (!name) return { skip: 'CONTACT_NAME_UNAVAILABLE' };
      return { name };
    }
    default:
      throw new Error(`unknown rule ${spec.rule}`);
  }
}

function plan(input) {
  const profileData = parse(input.profile, 'profile');
  const assets = parse(input.assets, 'assets');
  const eventItemId = String(input.eventItemId || '');
  const maxRenames = Number(input.maxRenames) > 0 ? Number(input.maxRenames) : 150;

  const out = { ok: false, abort: null, renames: [], skipped: [], unchanged: 0, truncated: [], counts: {} };
  const profile = first(profileData.items);
  if (!profile) { out.abort = 'PROFILE_NOT_FOUND'; return out; }
  if (String(profile.id) !== eventItemId) { out.abort = 'PROFILE_ID_MISMATCH'; return out; }
  if (!profile.board || String(profile.board.id) !== CLIENT_PROFILES_BOARD) { out.abort = 'NOT_A_CLIENT_PROFILE'; return out; }
  if (profile.state && profile.state !== 'active') { out.abort = 'PROFILE_NOT_ACTIVE'; return out; }
  const profileName = clean(profile.name);
  if (!profileName) { out.abort = 'PROFILE_NAME_EMPTY'; return out; }
  if (profileName.length > MAX_NAME_LENGTH) { out.abort = 'PROFILE_NAME_TOO_LONG'; return out; }

  const ctx = { profileId: String(profile.id), profileName, contactIds: new Set(ids(first(profile.contacts))) };
  const seen = new Set();

  for (const alias of Object.keys(SPECS)) {
    const spec = SPECS[alias];
    if (!(alias in assets)) { out.abort = `MISSING_ALIAS_${alias}`; out.renames = []; return out; }
    const { items, truncated } = itemsOf(assets, alias);
    if (truncated) out.truncated.push(alias);
    for (const item of items) {
      const key = `${spec.boardId}:${item.id}`;
      if (seen.has(key)) continue; // same item found through two link columns
      seen.add(key);
      if (item.state && item.state !== 'active') { out.skipped.push({ boardId: spec.boardId, itemId: String(item.id), reason: 'ITEM_NOT_ACTIVE' }); continue; }
      const t = target(spec, item, ctx);
      if (t.skip) { out.skipped.push({ boardId: spec.boardId, itemId: String(item.id), reason: t.skip }); continue; }
      if (!t.name) { out.skipped.push({ boardId: spec.boardId, itemId: String(item.id), reason: 'EMPTY_TARGET' }); continue; }
      if (t.name.length > MAX_NAME_LENGTH) { out.skipped.push({ boardId: spec.boardId, itemId: String(item.id), reason: 'TARGET_TOO_LONG' }); continue; }
      if (t.name === item.name) { out.unchanged += 1; continue; }
      out.renames.push({ boardId: spec.boardId, itemId: String(item.id), newName: t.name, rule: spec.rule });
      out.counts[alias] = (out.counts[alias] || 0) + 1;
    }
  }

  if (out.renames.length > maxRenames) {
    out.abort = 'TOO_MANY_RENAMES';
    out.counts.planned = out.renames.length;
    out.renames = [];
    return out;
  }
  out.ok = true;
  return out;
}

// Node (tests) export; ignored by Make, which runs the file body with `input` defined.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { plan, SPECS };
}
if (typeof input !== 'undefined') {
  return plan(input); // eslint-disable-line no-restricted-syntax -- Make Code module returns its output
}
