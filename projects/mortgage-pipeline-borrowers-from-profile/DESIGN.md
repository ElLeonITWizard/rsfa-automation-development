---
project_id: MP-BORROWERS-FROM-PROFILE
project_slug: mortgage-pipeline-borrowers-from-profile
owner: RSFA
technical_owner: tech@rsfa.co.nz
created: 2026-11-11
last_modified: 2026-11-11
---

# Design (concise; small change — includes requirements, tests, deployment and rollback)

## Current state (Confirmed from live system, 2026-11-10)

- `9756260` "M.com: Move to Pipeline (Sep 2026)" creates the Mortgage Pipeline item (`5025201889`) with the Lead's name, links `*Leads` (`board_relation_mkyaz0ej`) and `Client Profiles` (`board_relation_mkyercdt`). It does **not** set `Borrowers` (`board_relation_mkyf123a`).
- `8278547` links Trusts in `Trusts & Companies Owned` (`board_relation_mkyg4g6n`).
- `1232945` renames the item from Borrowers on a Borrowers **change** (Monday webhook `25075147`).
- The board had no `create_item` webhook.

## Solution

New, independent scenario **`10141397` "M.com: Mortgage Pipeline Borrowers from Client Profile (Nov 2026)"**. `9756260` is not modified.

Trigger: Monday webhook `41872482` (`create_item` on `5025201889`) → hook `4504974`. Wait 5 s → read item (Lead link, Borrowers, Client Profile and its Contacts) → Code module `borrowers-from-profile.js` → `change_multiple_column_values`: Borrowers = the profile's Contacts, name = their names joined " & ". Setting Borrowers is a change event, so `1232945` also runs and writes the same name.

Acts only when: Lead link present (created from the Leads board), exactly one active Client Profile with contacts, Borrowers empty. Otherwise it does nothing (reason code). It never overwrites Borrowers, and never adds Trusts/Companies as Borrowers (Rod's manual swap). Errors → `8732008` + Ignore. Sequential off.

## Tests

| ID | Test | Status |
|---|---|---|
| U-01 | 12 unit tests | **Passed** 2026-11-11 |
| V-01 | Live read query on the real item `2902236767` (from a test Lead, Borrowers empty) + planner → fill both contacts | **Passed** |
| V-02 | Make module validation of the mutation | **Passed** |
| T-01 | Webhook challenge | **Passed** (run 00:27:43, 2 ops) |
| T-02 | Item created like `9756260` (Lead + test CP `2519813525`): `2904660138` | **Passed**: Borrowers = 2 contacts; name "Leo Test 15 & leotest 14" (5 ops); `1232945` ran once (same name) |
| T-03 | Manual item (no Lead link): `2904660150` | **Passed**: untouched (4 ops) |
| T-04 | Real Lead → Mortgage Pipeline | Pending: verify on the next real lead (Make history of `10141397`) |

Test items archived after the tests.

## Known follow-ups (not done)

- **Back-fill:** 4 existing items from Leads with empty Borrowers (`2776724386`, `2855027194`, `2877880062`, `2902236767`). Can be done with `manual_rerun` or a one-off update, on approval.
- **Manual items** (Rod: "possibly done manually, need to allow for"): not covered. It needs a trigger on the Client Profiles link of the item.
- **`1054927`** still renames Mortgage Pipeline items with the CP name on a Contact rename. That conflicts with the Borrowers rule when the borrower is a trust or company.

## Rollback

Deactivate `10141397`; delete Monday webhook `41872482` (`mutation { delete_webhook(id: 41872482) { id } }`). Do not delete `25075147`. Borrowers already set stay.
