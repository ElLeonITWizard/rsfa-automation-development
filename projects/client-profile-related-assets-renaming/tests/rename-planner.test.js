// Unit tests for make/code/rename-planner.js. Fictional data only ("Jane Example", "Sam Sample").
// Run: node tests/rename-planner.test.js
'use strict';
const assert = require('assert');
const path = require('path');
const { plan, SPECS } = require(path.join(__dirname, '..', 'make', 'code', 'rename-planner.js'));

const CP = '900000001';
const JANE = '800000001';
const SAM = '800000002';
const OTHER_CP = '900000099';
const STRANGER = '800000099';

function page(items, cursor = null) { return [{ items_page: { cursor, items } }]; }
function rel(idsList, names) {
  const v = { linked_item_ids: idsList };
  if (names) v.linked_items = idsList.map((id, i) => ({ id, name: names[i] })).reverse(); // API order not guaranteed
  return [v];
}
function emptyAssets() {
  const a = {};
  for (const k of Object.keys(SPECS)) a[k] = page([]);
  return a;
}
function profile(name = 'Jane Example & Sam Sample', contacts = [JANE, SAM], extra = {}) {
  return { items: [{ id: CP, name, state: 'active', board: { id: '5024661649' }, contacts: rel(contacts), ...extra }] };
}
function run(assets, prof = profile(), more = {}) {
  return plan({ profile: prof, assets, eventItemId: CP, ...more });
}

const tests = [];
const test = (name, fn) => tests.push([name, fn]);

test('cp rule: Lead, Mortgage App, SOP Masterboard, KiwiSaver boards take the profile name', () => {
  const a = emptyAssets();
  a.leads = page([{ id: '1', name: 'Jane Example', state: 'active', link: rel([CP]) }]);
  a.mortgageApp = page([{ id: '2', name: 'Old Name', state: 'active', link: rel([CP]) }]);
  a.sopMasterboard = page([{ id: '3', name: 'Old Name', state: 'active', link: rel([CP]) }]);
  a.kiwisaverPipeline = page([{ id: '4', name: 'Old Name', state: 'active', link: rel([CP]) }]);
  a.existingKiwisaver = page([{ id: '5', name: 'Old Name', state: 'active', link: rel([CP]) }]);
  const r = run(a);
  assert.strictEqual(r.ok, true);
  assert.deepStrictEqual(r.renames.map((x) => [x.boardId, x.itemId, x.newName]), [
    ['2074688480', '1', 'Jane Example & Sam Sample'],
    ['5025483251', '2', 'Jane Example & Sam Sample'],
    ['5026186805', '3', 'Jane Example & Sam Sample'],
    ['5025201954', '4', 'Jane Example & Sam Sample'],
    ['5024672484', '5', 'Jane Example & Sam Sample'],
  ]);
});

test('cp rule: item linked to several profiles is skipped, not renamed', () => {
  const a = emptyAssets();
  a.leads = page([{ id: '1', name: 'X', state: 'active', link: rel([CP, OTHER_CP]) }]);
  const r = run(a);
  assert.strictEqual(r.renames.length, 0);
  assert.deepStrictEqual(r.skipped, [{ boardId: '2074688480', itemId: '1', reason: 'LINKED_TO_OTHER_OR_MULTIPLE_PROFILES' }]);
});

test('KiwiSaver Pipeline found through both link columns is planned once', () => {
  const a = emptyAssets();
  a.kiwisaverPipeline = page([{ id: '4', name: 'Old', state: 'active', link: rel([CP]) }]);
  a.kiwisaverPipelineLegacy = page([{ id: '4', name: 'Old', state: 'active', link: rel([CP]) }]);
  assert.strictEqual(run(a).renames.length, 1);
});

test('borrowers rule matches 1228763/1232945: "A, B" -> "A & B"', () => {
  const a = emptyAssets();
  a.mortgagePipeline = page([{ id: '10', name: 'Jane Example', state: 'active', people: [{ linked_item_ids: [JANE, SAM], display_value: 'Jane Example, Sam Sample' }] }]);
  a.existingMortgages = page([{ id: '11', name: 'Jane Example & Sam Sample', state: 'active', people: [{ linked_item_ids: [JANE, SAM], display_value: 'Jane Example, Sam Sample' }] }]);
  const r = run(a);
  assert.deepStrictEqual(r.renames.map((x) => [x.itemId, x.newName]), [['10', 'Jane Example & Sam Sample']]);
  assert.strictEqual(r.unchanged, 1);
});

test('borrowers rule does NOT use the profile name (Borrowers differ from profile)', () => {
  const a = emptyAssets();
  a.existingMortgages = page([{ id: '11', name: 'Jane Example & Sam Sample', state: 'active', people: [{ linked_item_ids: [JANE], display_value: 'Jane Example' }] }]);
  assert.deepStrictEqual(run(a).renames.map((x) => x.newName), ['Jane Example']);
});

test('borrowers empty -> skipped (never blank a name)', () => {
  const a = emptyAssets();
  a.existingMortgages = page([{ id: '11', name: 'Keep Me', state: 'active', people: [{ linked_item_ids: [], display_value: '' }] }]);
  const r = run(a);
  assert.strictEqual(r.renames.length, 0);
  assert.strictEqual(r.skipped[0].reason, 'NO_BORROWERS');
});

test('owners rule matches 1215342: owners in link order joined " & " + " | provider"', () => {
  const a = emptyAssets();
  a.existingInsuranceByProfile = page([{ id: '20', name: 'Old', state: 'active', people: rel([SAM, JANE], ['Sam Sample', 'Jane Example']), provider: [{ text: 'Example Life' }] }]);
  a.insurancePipelineByOwner = page([{ id: '21', name: 'Old', state: 'active', people: rel([JANE], ['Jane Example']), provider: [{ text: '' }] }]);
  const r = run(a);
  assert.deepStrictEqual(r.renames.map((x) => [x.itemId, x.newName]), [['21', 'Jane Example'], ['20', 'Sam Sample & Jane Example | Example Life']]);
});

test('owners rule: same policy found by profile and by owner is planned once', () => {
  const a = emptyAssets();
  const item = { id: '20', name: 'Old', state: 'active', people: rel([JANE], ['Jane Example']), provider: [{ text: '' }] };
  a.existingInsuranceByProfile = page([item]);
  a.existingInsuranceByOwner = page([item]);
  assert.strictEqual(run(a).renames.length, 1);
});

test('contact rule: IQ, KQ and Aircall take the single linked contact name', () => {
  const a = emptyAssets();
  a.insuranceQuestionnaire = page([{ id: '30', name: 'Jane Exampel', state: 'active', link: rel([JANE], ['Jane Example']) }]);
  a.kiwisaverQuestionnaire = page([{ id: '31', name: 'Old', state: 'active', link: rel([SAM], ['Sam Sample']) }]);
  a.aircall = page([
    { id: '32', name: 'Aircall new contact', state: 'active', link: rel([JANE], ['Jane Example']), contactStatus: [{ text: 'No' }] },
    { id: '33', name: 'Unknown', state: 'active', link: rel([JANE], ['Jane Example']), contactStatus: [{ text: 'Revert' }] },
  ]);
  const r = run(a);
  assert.deepStrictEqual(r.renames.map((x) => [x.itemId, x.newName]), [['30', 'Jane Example'], ['31', 'Sam Sample'], ['32', 'Jane Example']]);
  assert.deepStrictEqual(r.skipped, [{ boardId: '5026308494', itemId: '33', reason: 'AIRCALL_REVERT_IN_PROGRESS' }]);
});

test('contact rule: contact outside the profile or several contacts -> skipped', () => {
  const a = emptyAssets();
  a.insuranceQuestionnaire = page([
    { id: '30', name: 'Old', state: 'active', link: rel([STRANGER], ['Someone Else']) },
    { id: '31', name: 'Old', state: 'active', link: rel([JANE, SAM], ['Jane Example', 'Sam Sample']) },
  ]);
  const r = run(a);
  assert.strictEqual(r.renames.length, 0);
  assert.deepStrictEqual(r.skipped.map((s) => s.reason), ['CONTACT_NOT_IN_PROFILE', 'NOT_EXACTLY_ONE_CONTACT']);
});

test('idempotent: second run over an already-renamed state plans nothing', () => {
  const a = emptyAssets();
  a.leads = page([{ id: '1', name: 'Jane Example & Sam Sample', state: 'active', link: rel([CP]) }]);
  a.aircall = page([{ id: '32', name: 'Jane Example', state: 'active', link: rel([JANE], ['Jane Example']), contactStatus: [{ text: 'No' }] }]);
  const r = run(a);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.renames.length, 0);
  assert.strictEqual(r.unchanged, 2);
});

test('whitespace is normalised; names with quotes/ampersands pass through unchanged', () => {
  const a = emptyAssets();
  a.leads = page([{ id: '1', name: 'Old', state: 'active', link: rel([CP]) }]);
  const r = run(a, profile('  Jane  "JJ" Example &  Sam O’Sample '));
  assert.strictEqual(r.renames[0].newName, 'Jane "JJ" Example & Sam O’Sample');
});

test('guards: missing/archived/foreign/empty profile aborts with no renames', () => {
  const a = emptyAssets();
  a.leads = page([{ id: '1', name: 'Old', state: 'active', link: rel([CP]) }]);
  assert.strictEqual(run(a, { items: [] }).abort, 'PROFILE_NOT_FOUND');
  assert.strictEqual(run(a, profile(undefined, undefined, { state: 'archived' })).abort, 'PROFILE_NOT_ACTIVE');
  assert.strictEqual(run(a, profile(undefined, undefined, { board: { id: '2074688484' } })).abort, 'NOT_A_CLIENT_PROFILE');
  assert.strictEqual(run(a, profile('   ')).abort, 'PROFILE_NAME_EMPTY');
  assert.strictEqual(plan({ profile: profile(), assets: a, eventItemId: '123' }).abort, 'PROFILE_ID_MISMATCH');
  for (const p of [{ items: [] }, profile('  ')]) assert.strictEqual(run(a, p).renames.length, 0);
});

test('a missing alias in the response aborts (query/spec drift)', () => {
  const a = emptyAssets();
  delete a.aircall;
  const r = run(a);
  assert.strictEqual(r.abort, 'MISSING_ALIAS_aircall');
  assert.strictEqual(r.renames.length, 0);
});

test('safety cap: more renames than maxRenames aborts with nothing applied', () => {
  const a = emptyAssets();
  a.aircall = page(Array.from({ length: 6 }, (_, i) => ({ id: String(100 + i), name: 'Unknown', state: 'active', link: rel([JANE], ['Jane Example']), contactStatus: [{ text: 'No' }] })));
  const r = run(a, profile(), { maxRenames: 5 });
  assert.strictEqual(r.abort, 'TOO_MANY_RENAMES');
  assert.strictEqual(r.renames.length, 0);
  assert.strictEqual(r.counts.planned, 6);
});

test('truncated pages are reported (cursor not null)', () => {
  const a = emptyAssets();
  a.aircall = page([], 'next-cursor');
  assert.deepStrictEqual(run(a).truncated, ['aircall']);
});

test('inputs may arrive as JSON text (Make Transform-to-JSON) or as objects', () => {
  const a = emptyAssets();
  a.leads = page([{ id: '1', name: 'Old', state: 'active', link: rel([CP]) }]);
  const r = plan({ profile: JSON.stringify(profile()), assets: JSON.stringify(a), eventItemId: Number(CP) });
  assert.strictEqual(r.renames.length, 1);
});

test('too-long target is skipped (Monday 255-char name limit)', () => {
  const a = emptyAssets();
  a.existingMortgages = page([{ id: '11', name: 'Old', state: 'active', people: [{ linked_item_ids: [JANE], display_value: 'x'.repeat(256) }] }]);
  assert.strictEqual(run(a).skipped[0].reason, 'TARGET_TOO_LONG');
});

test('query aliases and planner SPECS stay in sync', () => {
  const fs = require('fs');
  const q = fs.readFileSync(path.join(__dirname, '..', 'make', 'queries', 'related-assets.graphql'), 'utf8');
  const aliases = [...q.matchAll(/^\s+(\w+): boards\(ids: \[(\d+)\]/gm)].map((m) => [m[1], m[2]]);
  assert.deepStrictEqual(aliases, Object.entries(SPECS).map(([k, v]) => [k, v.boardId]));
});

test('Make-style execution: file body run as a function of `input` (no `module`) returns the plan', async () => {
  const fs = require('fs');
  const code = fs.readFileSync(path.join(__dirname, '..', 'make', 'code', 'rename-planner.js'), 'utf8');
  const a = emptyAssets();
  a.leads = page([{ id: '1', name: 'Old', state: 'active', link: rel([CP]) }]);
  const wrapped = new Function('input', 'module', code); // Make wraps the editor code; `module` is not defined there
  const r = wrapped({ profile: profile(), assets: a, eventItemId: CP }, undefined);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.renames[0].newName, 'Jane Example & Sam Sample');
});

test('blueprint embeds exactly the tested planner and the generated query', () => {
  const fs = require('fs');
  const bp = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'make', 'blueprints', 'cp-rename-cascade.candidate-v1.json'), 'utf8'));
  const code = fs.readFileSync(path.join(__dirname, '..', 'make', 'code', 'rename-planner.js'), 'utf8');
  const flat = [];
  const walk = (fl) => fl.forEach((m) => { flat.push(m); (m.routes || []).forEach((r) => walk(r.flow)); walk(m.onerror || []); });
  walk(bp.flow);
  assert.strictEqual(flat.find((m) => m.module === 'code:ExecuteCode').mapper.codeEditorJavascript, code);
  const q = flat.find((m) => m.id === 5).mapper.queryBody;
  assert.ok(!q.includes('__PROFILE_ID__') && !q.includes('__CONTACT_IDS__'));
  assert.strictEqual((q.match(/: boards\(ids:/g) || []).length, Object.keys(SPECS).length);
  assert.ok(!JSON.stringify(bp).includes('hook.eu2.make.com'), 'no webhook URL in the blueprint');
});

let failed = 0;
for (const [name, fn] of tests) {
  try { fn(); console.log(`PASS ${name}`); } catch (e) { failed += 1; console.log(`FAIL ${name}\n  ${e.message}`); }
}
console.log(`\n${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
