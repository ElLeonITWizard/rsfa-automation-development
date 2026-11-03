// RSFA — Client Profile name from its Contacts (candidate).
//
// Body of the Make "Code" module (code:ExecuteCode, JavaScript) in the candidate scenario
// "M.com: Client Profile Name from Contacts (Nov 2026)". Node tests load this same file
// (tests/name-from-contacts.test.js).
//
// NEVER write double curly braces anywhere in this file, comments included. Make evaluates them as mapping
// expressions inside the Code field, and the module then returns an empty result (lesson from 2026-11-02).
// Keep the single top-level return at the end.
//
// Inputs (mapped in the module):
//   profile      Monday GraphQL data of the Client Profile read: an object with key "items" (object or JSON text)
//   eventItemId  the Client Profile item ID from the webhook
// Output:
//   { action: "rename" | "skip", reason, itemId, newName }
// The rule is the same as M.com: Updates profile name when participants added (1054932) and
// M.com: CP and Deals Renaming after Contact Renaming (1054927): Contacts text with "," replaced by " &".
// Unlike 1054932, it also applies when contacts are removed, and when the profile is created with contacts.
// A profile with NO contacts keeps its name (manual creation without contacts): nothing to derive.

const CLIENT_PROFILES_BOARD = '5024661649';
const MAX_NAME_LENGTH = 255; // Monday item-name limit

function parse(value, name) {
  if (value === undefined || value === null || value === '') throw new Error('missing input: ' + name);
  return typeof value === 'string' ? JSON.parse(value) : value;
}
function first(list) { return Array.isArray(list) && list.length ? list[0] : null; }
function clean(s) { return typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : ''; }

function planName(input) {
  const data = parse(input.profile, 'profile');
  const eventItemId = String(input.eventItemId || '');
  const item = first(data.items);
  const skip = (reason) => ({ action: 'skip', reason, itemId: item ? String(item.id) : eventItemId, newName: null });

  if (!item) return skip('PROFILE_NOT_FOUND');
  if (String(item.id) !== eventItemId) return skip('PROFILE_ID_MISMATCH');
  if (!item.board || String(item.board.id) !== CLIENT_PROFILES_BOARD) return skip('NOT_A_CLIENT_PROFILE');
  if (item.state && item.state !== 'active') return skip('PROFILE_NOT_ACTIVE');

  const rel = first(item.contacts) || {};
  const linked = Array.isArray(rel.linked_item_ids) ? rel.linked_item_ids : [];
  if (linked.length === 0) return skip('NO_CONTACTS');

  const display = clean(rel.display_value);
  if (!display) return skip('CONTACT_NAMES_UNAVAILABLE');
  const target = clean(display.replace(/,/g, ' &'));
  if (!target) return skip('EMPTY_TARGET');
  if (target.length > MAX_NAME_LENGTH) return skip('TARGET_TOO_LONG');
  if (target === item.name) return skip('UNCHANGED');
  return { action: 'rename', reason: 'CONTACTS', itemId: String(item.id), newName: target };
}

// Node (tests) export. In Make's runtime `module` is a function without `exports`, so this is skipped.
if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = { planName };
}
return typeof input !== 'undefined' ? planName(input) : undefined;
