// Unit tests for make/code/name-from-contacts.js. Fictional data only.
// Run: node tests/name-from-contacts.test.js
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', 'make', 'code', 'name-from-contacts.js');
const { planName } = require(SRC);

const CP = '900000001';
function profile(name, ids, display, extra = {}) {
  return { items: [{ id: CP, name, state: 'active', board: { id: '5024661649' },
    contacts: [{ linked_item_ids: ids, display_value: display }], ...extra }] };
}
const run = (p, id = CP) => planName({ profile: p, eventItemId: id });

const tests = [];
const test = (n, f) => tests.push([n, f]);

test('SuperForm path: placeholder name + 1 contact at creation -> contact name', () => {
  assert.deepStrictEqual(run(profile('Incoming form answer', ['1'], 'Jane Example')),
    { action: 'rename', reason: 'CONTACTS', itemId: CP, newName: 'Jane Example' });
});
test('Leads path: applicant name + 2 contacts -> "A & B" (same format as 1054932)', () => {
  assert.strictEqual(run(profile('Jane Example', ['1', '2'], 'Jane Example, Sam Sample')).newName, 'Jane Example & Sam Sample');
});
test('Leads path: name already correct -> skip UNCHANGED (second trigger is harmless)', () => {
  assert.deepStrictEqual(run(profile('Jane Example & Sam Sample', ['1', '2'], 'Jane Example, Sam Sample')).reason, 'UNCHANGED');
});
test('Manual path without contacts -> skip NO_CONTACTS, never fails, name kept', () => {
  const r = run(profile('Typed By Hand', [], ''));
  assert.deepStrictEqual([r.action, r.reason, r.newName], ['skip', 'NO_CONTACTS', null]);
});
test('Manual path: relation column missing entirely -> skip NO_CONTACTS', () => {
  const p = profile('Typed By Hand', [], ''); delete p.items[0].contacts;
  assert.strictEqual(run(p).reason, 'NO_CONTACTS');
});
test('Contact removed (CP 2519772272 case): "A & B" with only A left -> "A"', () => {
  assert.strictEqual(run(profile('Jane Example & Sam Sample', ['1'], 'Jane Example')).newName, 'Jane Example');
});
test('Contacts present but names not returned -> skip, never blank the name', () => {
  assert.strictEqual(run(profile('Keep Me', ['1'], '   ')).reason, 'CONTACT_NAMES_UNAVAILABLE');
});
test('guards: missing / other board / archived / id mismatch', () => {
  assert.strictEqual(run({ items: [] }).reason, 'PROFILE_NOT_FOUND');
  assert.strictEqual(run(profile('X', ['1'], 'A', { board: { id: '2074688484' } })).reason, 'NOT_A_CLIENT_PROFILE');
  assert.strictEqual(run(profile('X', ['1'], 'A', { state: 'archived' })).reason, 'PROFILE_NOT_ACTIVE');
  assert.strictEqual(run(profile('X', ['1'], 'A'), '123').reason, 'PROFILE_ID_MISMATCH');
});
test('too long target -> skip', () => {
  assert.strictEqual(run(profile('X', ['1'], 'x'.repeat(256))).reason, 'TARGET_TOO_LONG');
});
test('whitespace normalised; apostrophes and hyphens kept', () => {
  assert.strictEqual(run(profile('X', ['1', '2'], '  Jane  O’Example ,  Sam Sample-Smith ')).newName, 'Jane O’Example & Sam Sample-Smith');
});
test('input as JSON text works too', () => {
  assert.strictEqual(planName({ profile: JSON.stringify(profile('X', ['1'], 'Jane Example')), eventItemId: Number(CP) }).newName, 'Jane Example');
});
test('Make-style execution (function of input, module without exports)', () => {
  const code = fs.readFileSync(SRC, 'utf8');
  const fakeModule = function () {};
  const r = new Function('input', 'module', code)({ profile: profile('X', ['1'], 'Jane Example'), eventItemId: CP }, fakeModule);
  assert.strictEqual(r.newName, 'Jane Example');
});
test('source has no double curly braces', () => {
  const code = fs.readFileSync(SRC, 'utf8');
  assert.ok(!code.includes('{' + '{') && !code.includes('}' + '}'));
});
test('blueprint embeds exactly this code and no webhook URL', () => {
  const bpPath = path.join(__dirname, '..', 'make', 'blueprints', 'cp-name-from-contacts.candidate-v1.json');
  const bp = JSON.parse(fs.readFileSync(bpPath, 'utf8'));
  const flat = [];
  const walk = (fl) => fl.forEach((m) => { flat.push(m); (m.routes || []).forEach((r) => walk(r.flow)); walk(m.onerror || []); });
  walk(bp.flow);
  assert.strictEqual(flat.find((m) => m.module === 'code:ExecuteCode').mapper.codeEditorJavascript, fs.readFileSync(SRC, 'utf8'));
  assert.strictEqual(bp.metadata.scenario.sequential, false, 'sequential must stay off (webhook challenge)');
  assert.ok(!JSON.stringify(bp).includes('hook.eu2.make.com'));
});

let failed = 0;
for (const [n, f] of tests) { try { f(); console.log('PASS ' + n); } catch (e) { failed++; console.log('FAIL ' + n + '\n  ' + e.message); } }
console.log(`\n${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
