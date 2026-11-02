---
project_id: CP-RENAME-CASCADE
project_slug: client-profile-related-assets-renaming
title: Client Profile Renaming - Related Assets Renaming - Test Plan
document_type: test-plan
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: RSFA technical consultant (for Rod Schubert)
created: 2026-10-31
last_modified: 2026-11-02
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001]
related_systems: [Monday.com, Make.com]
---

Use fictional or sanitised data. Do not use real client data.

Related: [REQUIREMENTS.md](./REQUIREMENTS.md) | [DESIGN.md](./DESIGN.md) | [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md)

## Test objective

Confirm that the naming rules are right, that nothing is renamed outside the rules, and that the scenarios behave correctly in Make before activation.

## Scope

AC-001…AC-005, FR-001…FR-006, NFR-001…NFR-006.

## Out of scope

Power Automate folder rename (unchanged); historical back-fill.

## Test environment

- Local: Node ≥ 18 (`node tests/rename-planner.test.js`), Python 3 (generators).
- Make: the candidate scenarios imported **inactive**, then tested with dedicated fictional items in production boards (no sandbox boards exist — TODO: verify), grouped in each board's test group if available.

## Test data rules

- Fictional names only (for example "Testy McTestface", "Zz Test Borrower").
- Create test Contacts / Client Profile / items; delete or archive them after the test (separate approval for the cleanup).
- Never rename a real client's item to test.

## Test cases

| ID | Test | Expected result | Status |
|---|---|---|---|
| U-01 | Planner unit tests (21 cases: each rule, guards, idempotency, cap, truncation, Make-style wrapper execution, blueprint embeds the tested code) | 21/21 pass | **Passed** 2026-10-31 and again 2026-11-02 after the scope change (`tests/results/2026-11-02-unit.txt`) |
| V-01 | Related-assets query executed read-only against a real Client Profile in Monday | Executes without error; reverse filters return the linked items | **Passed** 2026-10-31 (query structure only; output not stored) |
| V-02 | Make `validate_blueprint_schema` — Lead blueprint (full) | Valid | **Passed** 2026-10-31 |
| V-03 | Make `validate_blueprint_schema` — cascade blueprint (same topology and module configs; the long query and code strings were shortened for the call) | Valid | **Partially verified** 2026-10-31 |
| V-04 | Make `validate_module_configuration`: `monday:ExecuteGraphQLQueryV2` (mutation + variables), `code:ExecuteCode`, `builtin:BasicFeeder`, `gateway:WebhookRespond` | Valid | **Passed** 2026-10-31 (WebhookRespond after correcting `status` to a number) |
| D-01 | Re-read scenario `10083674` after import | 18 modules; Code module and assets query identical to Git | **Passed** 2026-11-02 |
| V-05 | `validate_module_configuration` for `scenario-service:CallSubscenario` | — | **Not testable** with the validator ("module not found" for app version 1); configuration copied verbatim from live scenarios `9911427`/`1054927` |
| T-01 | Monday `challenge` handshake when registering each webhook | Monday accepts the URL | Planned |
| T-02 | Rename a test CP manually | Test Lead, Mortgage App, SOP Masterboard, Existing KiwiSaver renamed to the new name (AC-001); Mortgage Pipeline and KiwiSaver Pipeline untouched by the cascade | Planned |
| T-03 | Same test CP: Existing Mortgages with test Borrowers | Named from Borrowers (`A & B`), not from the profile | Planned |
| T-04 | Rename a test **Contact** | `1054927` renames the CP → the Monday webhook fires for the API rename → cascade renames IQ, KQ, Aircall test items (AC-002) | Planned |
| T-05 | Test policies on Insurance Pipeline / Existing Insurance | `Owners & … \| Provider`, identical to what `1215342` produces | Planned |
| T-06 | Send the same event twice | Second run: 0 renames (AC-004) | Planned |
| T-07 | Test Lead linked to two test CPs | Lead untouched; listed in `skipped` (AC-005) | Planned |
| T-08 | Test Aircall item with `Contact Created/Updated` = `Revert` | Untouched | Planned |
| T-09 | Test CP with no contacts | Contact lookups use `0`; CP-named items still renamed; no error | Planned |
| T-10 | `manual_rerun` event for a test CP | Same result as a rename | Planned |
| T-11 | Force a rename failure (for example a deleted test item between read and write) | Email from `8732008` with board/item IDs; the other items renamed | Planned |
| T-12 | `maxRenames` set temporarily to 1 with 2 changes | `TOO_MANY_RENAMES` email; nothing renamed | Planned |
| T-13 | Lead scenario: link a test Lead to a test CP | Lead renamed to the CP name (AC-003) | Planned |
| T-14 | Lead scenario: clear the link / link 2 CPs | No rename | Planned |
| T-15 | Downstream: SharePoint folder of the test CP | Renamed by Power Automate as today (unchanged) | Planned |
| T-16 | Downstream: no other scenario reacts to the renames (check Make history of `9911427`, `10037840`, `1228763`, `1232945`, `1215342`) | No unexpected runs or name flips | Planned |
| T-17 | After the `1054927` change: rename a test Contact | CP renamed by `1054927`; Existing Mortgages / Existing KiwiSaver / insurance renamed only by the cascade; Mortgage Pipeline and KiwiSaver Pipeline still renamed by `1054927` as before | Planned |

## Duplicate-prevention checks

U-01 (dedup and idempotency cases), T-06.

## Failure-path tests

U-01 (guards), T-11, T-12.

## Downstream validation

T-15, T-16.

## Regression coverage

T-17 (`1054927`), plus AUTO-NAMING-001 §20 regression list.

## Results

`tests/results/2026-10-31-unit.txt`.
