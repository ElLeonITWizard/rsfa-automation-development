// Unit tests for make/code/borrowers-from-profile.js. Fictional data only.
// Run: node tests/borrowers-from-profile.test.js
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', 'make', 'code', 'borrowers-from-profile.js');
const { planBorrowers } = require(SRC);

const ITEM = '700000001';
function item({ lead = ['1'], borrowers = [], profiles = ['900'], profileState = 'active', contacts = ['11', '12'], display = 'Jane Example, Sam Sample', extra = {} } = {}) {
  return { items: [{ id: ITEM, name: 'Jane Example', state: 'active', board: { id: '5025201889' },
    lead: [{ linked_item_ids: lead }], borrowers: [{ linked_item_ids: borrowers }],
    profile: [{ linked_item_ids: profiles, linked_items: profiles.map((id) => ({ id, state: profileState,
      contacts: [{ linked_item_ids: contacts, display_value: display }] })) }], ...extra }] };
}
const run = (d, id = ITEM) => planBorrowers({ item: d, eventItemId: id });

const tests = [];
const test = (n, f) => tests.push([n, f]);

test('from Leads board, empty Borrowers -> Borrowers = CP contacts, name "A & B"', () => {
  const r = run(item());
  assert.strictEqual(r.action, 'fill');
  assert.deepStrictEqual(JSON.parse(r.columnValues), { board_relation_mkyf123a: { item_ids: [11, 12] }, name: 'Jane Example & Sam Sample' });
});
test('single contact -> single borrower', () => {
  const r = run(item({ contacts: ['11'], display: 'Jane Example' }));
  assert.deepStrictEqual(JSON.parse(r.columnValues), { board_relation_mkyf123a: { item_ids: [11] }, name: 'Jane Example' });
});
test('manual item (no Lead link) -> skip, nothing written', () => {
  assert.deepStrictEqual([run(item({ lead: [] })).action, run(item({ lead: [] })).reason], ['skip', 'NOT_FROM_LEADS_BOARD']);
});
test('Borrowers already set (e.g. a trust added by hand) -> never overwritten', () => {
  assert.strictEqual(run(item({ borrowers: ['55'] })).reason, 'BORROWERS_ALREADY_SET');
});
test('no / several Client Profiles -> skip', () => {
  assert.strictEqual(run(item({ profiles: [] })).reason, 'NO_CLIENT_PROFILE');
  assert.strictEqual(run(item({ profiles: ['900', '901'] })).reason, 'MULTIPLE_CLIENT_PROFILES');
});
test('profile without contacts or archived -> skip', () => {
  assert.strictEqual(run(item({ contacts: [], display: '' })).reason, 'PROFILE_HAS_NO_CONTACTS');
  assert.strictEqual(run(item({ profileState: 'archived' })).reason, 'CLIENT_PROFILE_NOT_ACTIVE');
  assert.strictEqual(run(item({ display: '  ' })).reason, 'CONTACT_NAMES_UNAVAILABLE');
});
test('guards: missing item, other board, archived item, id mismatch', () => {
  assert.strictEqual(run({ items: [] }).reason, 'ITEM_NOT_FOUND');
  assert.strictEqual(run(item({ extra: { board: { id: '5025201920' } } })).reason, 'NOT_MORTGAGE_PIPELINE');
  assert.strictEqual(run(item({ extra: { state: 'deleted' } })).reason, 'ITEM_NOT_ACTIVE');
  assert.strictEqual(run(item(), '1').reason, 'ITEM_ID_MISMATCH');
});
test('names with quotes and apostrophes are safely JSON-encoded', () => {
  const r = run(item({ display: 'Jane "JJ" O’Example, Sam Sample' }));
  assert.strictEqual(JSON.parse(r.columnValues).name, 'Jane "JJ" O’Example & Sam Sample');
});
test('input as JSON text', () => {
  assert.strictEqual(planBorrowers({ item: JSON.stringify(item()), eventItemId: Number(ITEM) }).action, 'fill');
});
test('Make-style execution (function of input, module without exports)', () => {
  const r = new Function('input', 'module', fs.readFileSync(SRC, 'utf8'))({ item: item(), eventItemId: ITEM }, function () {});
  assert.strictEqual(r.action, 'fill');
});
test('source has no double curly braces', () => {
  const code = fs.readFileSync(SRC, 'utf8');
  assert.ok(!code.includes('{' + '{') && !code.includes('}' + '}'));
});
test('blueprint embeds exactly this code, sequential off, no webhook URL', () => {
  const bp = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'make', 'blueprints', 'mp-borrowers-from-profile.candidate-v1.json'), 'utf8'));
  const flat = [];
  const walk = (fl) => fl.forEach((m) => { flat.push(m); (m.routes || []).forEach((r) => walk(r.flow)); walk(m.onerror || []); });
  walk(bp.flow);
  assert.strictEqual(flat.find((m) => m.module === 'code:ExecuteCode').mapper.codeEditorJavascript, fs.readFileSync(SRC, 'utf8'));
  assert.strictEqual(bp.metadata.scenario.sequential, false);
  assert.ok(!JSON.stringify(bp).includes('hook.eu2.make.com'));
});

let failed = 0;
for (const [n, f] of tests) { try { f(); console.log('PASS ' + n); } catch (e) { failed++; console.log('FAIL ' + n + '\n  ' + e.message); } }
console.log(`\n${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
