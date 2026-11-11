// RSFA — Mortgage Pipeline: default Borrowers from the Client Profile's Contacts (body of a Make Code module).
//
// Used by "M.com: Mortgage Pipeline Borrowers from Client Profile (Nov 2026)". Node tests load this same file.
// NEVER write double curly braces anywhere in this file (Make evaluates them inside the Code field).
// Keep the single top-level return at the end.
//
// Inputs:
//   item         Monday GraphQL data of the Mortgage Pipeline item read: an object with key "items" (object or JSON text)
//   eventItemId  the item ID from the webhook
// Output:
//   { action: "fill" | "skip", reason, itemId, columnValues }
//   columnValues is the JSON text for change_multiple_column_values: Borrowers = the profile's Contacts,
//   name = their names joined " & " (same format as M.com: Update Mortgage Pipeline Name from Borrowers, 1232945).
//
// Rules (Rod, 2026-11-07; requester, 2026-11-10):
//   only items created from the Leads board (Leads link present), exactly one active Client Profile,
//   that profile has contacts, and Borrowers is still empty. Everything else is skipped and nothing is written.
//   Trusts / Companies are not added as Borrowers: they are linked in their own column by 8278547; when the
//   borrower is a trust or company, the adviser swaps the Borrowers by hand (Rod's process).

const MORTGAGE_PIPELINE_BOARD = '5025201889';
const MAX_NAME_LENGTH = 255;

function parse(value, name) {
  if (value === undefined || value === null || value === '') throw new Error('missing input: ' + name);
  return typeof value === 'string' ? JSON.parse(value) : value;
}
function first(list) { return Array.isArray(list) && list.length ? list[0] : null; }
function ids(rel) { return rel && Array.isArray(rel.linked_item_ids) ? rel.linked_item_ids.map(String) : []; }
function clean(s) { return typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : ''; }

function planBorrowers(input) {
  const data = parse(input.item, 'item');
  const eventItemId = String(input.eventItemId || '');
  const item = first(data.items);
  const skip = (reason) => ({ action: 'skip', reason, itemId: item ? String(item.id) : eventItemId, columnValues: null });

  if (!item) return skip('ITEM_NOT_FOUND');
  if (String(item.id) !== eventItemId) return skip('ITEM_ID_MISMATCH');
  if (!item.board || String(item.board.id) !== MORTGAGE_PIPELINE_BOARD) return skip('NOT_MORTGAGE_PIPELINE');
  if (item.state && item.state !== 'active') return skip('ITEM_NOT_ACTIVE');
  if (ids(first(item.lead)).length === 0) return skip('NOT_FROM_LEADS_BOARD');
  if (ids(first(item.borrowers)).length > 0) return skip('BORROWERS_ALREADY_SET');

  const profileRel = first(item.profile) || {};
  const profileIds = ids(profileRel);
  if (profileIds.length !== 1) return skip(profileIds.length === 0 ? 'NO_CLIENT_PROFILE' : 'MULTIPLE_CLIENT_PROFILES');
  const profile = (profileRel.linked_items || []).find((p) => String(p.id) === profileIds[0]);
  if (!profile) return skip('CLIENT_PROFILE_UNAVAILABLE');
  if (profile.state && profile.state !== 'active') return skip('CLIENT_PROFILE_NOT_ACTIVE');

  const contactsRel = first(profile.contacts) || {};
  const contactIds = ids(contactsRel);
  if (contactIds.length === 0) return skip('PROFILE_HAS_NO_CONTACTS');
  const display = clean(contactsRel.display_value);
  if (!display) return skip('CONTACT_NAMES_UNAVAILABLE');
  const newName = clean(display.replace(/,/g, ' &'));
  if (!newName || newName.length > MAX_NAME_LENGTH) return skip('INVALID_NAME');

  const values = { board_relation_mkyf123a: { item_ids: contactIds.map(Number) }, name: newName };
  return { action: 'fill', reason: 'DEFAULT_BORROWERS', itemId: String(item.id), columnValues: JSON.stringify(values) };
}

// Node (tests) export. In Make's runtime `module` is a function without `exports`, so this is skipped.
if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = { planBorrowers };
}
return typeof input !== 'undefined' ? planBorrowers(input) : undefined;
