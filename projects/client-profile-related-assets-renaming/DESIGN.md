---
project_id: CP-RENAME-CASCADE
project_slug: client-profile-related-assets-renaming
title: Client Profile Renaming - Related Assets Renaming - Design
document_type: design
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: RSFA technical consultant (for Rod Schubert)
created: 2026-10-31
last_modified: 2026-11-02
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001]
related_systems: [Monday.com, Make.com]
---

## Design status

Draft. Candidate blueprints are built and tested locally. Nothing has been created in Make or Monday.

## Problem being solved

See REQUIREMENTS.md. Current behaviour: CURRENT_STATE_REFERENCES.md.

## Proposed architecture

Three changes, all in Make plus two Monday webhooks:

```mermaid
flowchart LR
  A[Contact renamed] --> B[1054927\nrenames Client Profile\n(mortgage branches removed)]
  M[Manual CP rename] --> W1
  B --> W1[(Monday webhook\nchange_name on Client Profiles)]
  P[1054932 participants added] --> W1
  W1 --> C[NEW: M.com: Related Assets Renaming\nafter Client Profile Rename (Nov 2026)]
  W1 --> SP[Power Automate:\nSharePoint folder rename\n(unchanged)]
  C --> R[Leads · Mortgage App · SOP Masterboard ·\nKiwiSaver Pipeline/Existing ·\nMortgage Pipeline/Existing Mortgages (Borrowers) ·\nInsurance Pipeline/Existing Insurance (Owners | Provider) ·\nIQ · KQ · Aircall (Contact)]
  L[Lead 'Client Profiles' column changed] --> W2[(Monday webhook\nchange_specific_column_value\nboard_relation_mm7c1wcw)]
  W2 --> D[9711585 M.com: Lead Rename by\nClientProfile (Mar 2026), completed]
  D --> LR[Lead renamed to its CP]
```

1. **New scenario** `M.com: Related Assets Renaming after Client Profile Rename (Nov 2026)` — blueprint `make/blueprints/cp-rename-cascade.candidate-v1.json`.
2. **Completed scenario** `9711585` `M.com: Lead Rename by ClientProfile (Mar 2026)` — blueprint `make/blueprints/lead-rename-by-client-profile.candidate-v1.json` (keeps hook `4335040`).
3. **Prerequisite change to `1054927`** (revised 2026-11-02: no overlap with the cascade). Remove the routes the cascade now owns:
   - "Existing Mortgage Exists" (48, 49, 50, 51, 94, 95): wrong rule (CP name, not Borrowers) and races with the cascade.
   - "Existing KiwiSaver Exists" (65, 66, 67, 68, 98, 99).
   - "Contact has Insurance Pipeline Policies Associated" (83, 88, 73, 85).
   - "Contact has Existing Insurance Policies Associated" (84, 87, 80, 86).

   Keep:
   - The First/Last name update (101).
   - The Client Profile rename (32, 30), which is what fires the cascade on a Contact rename.
   - The "Mortgage Pipeline Exists" and "KiwiSaver Pipeline Exists" routes. Those boards are out of the cascade (in progress), so keeping their current behaviour is not an overlap.

   41 → 21 modules. **Do not deactivate `1054927`:** without it, a Contact rename would no longer rename the Client Profile, and the cascade would never fire for Contact renames.

   Edge case: an insurance policy whose owner Contact has **no** Client Profile is no longer renamed when that Contact is renamed. Contacts without a Client Profile are expected to be rare. `1215342` still renames the policy on owner or provider changes.

Why one cascade per profile, and not one scenario per board: one place holds every rule, one run gives one consistent result, and the rules are unit-tested (`tests/rename-planner.test.js`).

Why the Contact-named boards (IQ, KQ, Aircall) are in a *Client Profile* cascade: a Contact rename already renames the profile (`1054927`). That profile rename fires this cascade, which recomputes every item from the profile's current contacts. This covers both a manual CP rename and a Contact rename.

**Scope change 2026-11-02:** 💲Mortgage Pipeline and 📈 KiwiSaver Pipeline are excluded (boards in progress). The related-assets query has 12 lookups on 10 boards.

## Systems involved

Monday.com (12 boards read and renamed, Client Profiles read), Make.com (2 scenarios + 1 change), `8732008` failure email.

## Trigger

- Cascade: Make custom webhook (new hook, created at deployment) ← Monday webhook `change_name` on Client Profiles `5024661649`. Also accepts `{"event": {"type": "manual_rerun", "boardId": 5024661649, "pulseId": <id>}}` for recovery.
- Lead: existing hook `4335040` ← Monday webhook `change_specific_column_value` on Leads `2074688480`, column `board_relation_mm7c1wcw`.
- Both answer Monday's `challenge` handshake (same pattern as `9911427`).

## Inputs

| Input | Source | Required? | Notes |
|---|---|---|---|
| `event.pulseId`, `event.boardId`, `event.type` | Monday webhook | Yes | `pulseId` must be digits only (filter), because it is inlined into the GraphQL query |
| `event.columnId` | Monday webhook (Lead scenario) | Yes | Must be `board_relation_mm7c1wcw` |

## Outputs

| Output | Destination | Notes |
|---|---|---|
| Item name (`name`) | 12 boards | Only when different |
| Failure / review email | tech@rsfa.co.nz via `8732008` | IDs and codes only |

## Proposed data flow

Cascade: webhook → router (challenge \| event) → **[4] read Client Profile** (`id name state board contacts`) → **[5] read related assets**: one GraphQL request, 15 lookups across 12 boards, each `items_page` filtered by the board's own link column `any_of` [profile ID] or [contact IDs] → **[6] Code module** `rename-planner.js` computes `renames[]`, `skipped[]` and `abort` → router: **[8] iterator → [9] `change_simple_column_value`** per rename | **[12] review email** when aborted or truncated.

## Module/action sequence

| Step | Platform | Module or action | Purpose | Inputs | Outputs | Failure behaviour |
|---|---|---|---|---|---|---|
| 1 | Make | `gateway:CustomWebHook` | Receive Monday event | — | event | — |
| 3 | Make | `gateway:WebhookRespond` | Echo the `challenge` | `1.challenge` | — | — |
| 4 | Make | `monday:ExecuteGraphQLQueryV2` (conn. `240128`) | Read Client Profile | `pulseId` | profile | email `8732008` + Ignore (nothing renamed) |
| 5 | Make | `monday:ExecuteGraphQLQueryV2` | Read related assets (`make/queries/related-assets.graphql`) | profile ID, contact IDs (`0` if none) | 15 item lists | email + Ignore (nothing renamed) |
| 6 | Make | `code:ExecuteCode` (JavaScript) | Plan renames (`make/code/rename-planner.js`) | `4.body.data`, `5.body.data`, `pulseId`, `maxRenames=150` | `result.{ok, abort, renames, skipped, truncated, counts}` | email + Ignore (nothing renamed) |
| 8 | Make | `builtin:BasicFeeder` | One bundle per rename | `6.result.renames` | `{boardId, itemId, newName, rule}` | — |
| 9 | Make | `monday:ExecuteGraphQLQueryV2` | `change_simple_column_value(column_id: "name")` with GraphQL variables (safe for quotes) | bundle | — | email + Ignore: **this item only**, the others continue |
| 12 | Make | `scenario-service:CallSubscenario` `8732008` | Review alert | `abort`, `truncated` | email | — |

Lead scenario: webhook → router (challenge \| event) → **[3] read Lead** (`id name state board`, CP link with `linked_items { id name state }`) → filter (one active CP, name not empty, ≤ 255 characters, differs) → **[4] rename the Lead**. Each step has the email + Ignore handler.

## Filters and routing

- Event filter: `challenge` empty, `boardId = 5024661649`, `pulseId` matches `^[0-9]{1,20}$`, `type` ∈ {`update_name`, `change_name`, `manual_rerun`}.
- Rename route: `ok = true` and at least 1 rename. Review route: `abort` exists, or `truncated` is not empty.

## Mappings

Rules per board: REQUIREMENTS.md BR-001…BR-012, implemented in `SPECS` + `target()` of `rename-planner.js`. Column IDs: CURRENT_STATE_REFERENCES.md.

## IDs and identifiers

Board, column and connection IDs are listed in `make/queries/build_queries.py` and `make/build_blueprints.py` (single source; tests check the query aliases against `SPECS`).

## Duplicate prevention

The planner deduplicates `boardId:itemId`. The scenarios are **not** sequential (2026-11-02): sequential processing makes Make answer "Accepted" itself, so the challenge cannot be returned to Monday. Two near-simultaneous events for the same profile may run in parallel. Both recompute from current data, so they converge on the same names; at worst a name is written twice.

## Idempotency

The planner writes only when the computed name ≠ the current name. Re-running is always safe.

## Error handling

- A read or planning failure means nothing is renamed, and an email is sent.
- A single rename failure sends an email; the other renames continue (Ignore).
- `abort` codes: `PROFILE_NOT_FOUND`, `PROFILE_ID_MISMATCH`, `NOT_A_CLIENT_PROFILE`, `PROFILE_NOT_ACTIVE`, `PROFILE_NAME_EMPTY`, `PROFILE_NAME_TOO_LONG`, `MISSING_ALIAS_<alias>`, `TOO_MANY_RENAMES`.
- `skipped` reasons: `LINKED_TO_OTHER_OR_MULTIPLE_PROFILES`, `NO_BORROWERS`, `NO_POLICY_OWNERS`, `OWNER_NAME_UNAVAILABLE`, `NOT_EXACTLY_ONE_CONTACT`, `CONTACT_NOT_IN_PROFILE`, `CONTACT_NAME_UNAVAILABLE`, `AIRCALL_REVERT_IN_PROGRESS`, `ITEM_NOT_ACTIVE`, `EMPTY_TARGET`, `TARGET_TOO_LONG`.
- A lookup with more than 500 items: the first 500 are processed and an alert is sent (`truncated`).

## Logging

Make execution history (module 6 output: renames with new names; module 5 output: the previous names). No separate log board: the volume is low, and a log would hold client names. TODO: verify the history retention on RSFA's plan, and decide whether a log is needed.

## Alerts

`8732008` → tech@rsfa.co.nz.

## Manual recovery

Re-send the event as `manual_rerun` (HANDOVER.md). Restore a previous name from module 5's output in the execution history.

## Security

- No webhook URLs or secrets in Git (the cascade hook is `0` until created; the Lead hook is referenced by ID only).
- `pulseId` is validated as digits before it is inlined into GraphQL. Names travel only as GraphQL variables.
- Alerts carry IDs only. The scenario is not marked confidential, so that execution history stays inspectable; this can be revisited.

## Permissions

Monday connection `240128` ("My Monday v2 connection - 1"), the same one used by `8410524` / `9447215`. It needs read access to the 13 boards and write access to the 12 target boards. Board permissions on private boards (Client Profiles, Existing Mortgages, Existing Insurance, Aircall): TODO: verify that the connection's user can write to them (it already does in `1054927`/`1228763`/`1215342`).

## Rate limits

One run = 2 reads (1 heavy: 15 `items_page`) + N mutations. Monday complexity per query: TODO: verify at the first test (the read executed without error on 2026-10-31).

## Performance considerations

Operations per run ≈ 6 + N renames (+ Code module credits; TODO: verify the credit cost). An idle run with no change ≈ 6 operations.

## Dependencies

`8732008`; Monday webhooks; connection `240128`; the `code` app (premium tier 1, already used by `8731317`).

## Alternatives considered

| Alternative | Why not chosen |
|---|---|
| Extend `1054927` (Contact-rename) instead of a CP-rename trigger | Does not cover a manual CP rename; `1054927` is already 190 KB with 6 branches |
| One Make scenario per board | 12 scenarios to keep consistent; this is the drift problem being solved |
| Pure Make functions instead of the Code module | Rules spread over ~15 routes, not unit-testable; the Code module is already proven on RSFA's plan |
| Use the CP's reflection columns to find assets | Several links have no reflection (Leads, Mortgage App); reverse lookups are complete |
| Monday native automation / Workflow | ADR-001 (stop building Monday Workflows); cannot express the rules |
| Call `1215342` per policy for insurance | Extra webhook URL and operations; the rule is mirrored and unit-tested instead (keep in sync, see HANDOVER) |
| Make Monday "Watch item name" trigger | Cannot be re-run on demand for recovery or back-fill |

## Rejected alternatives

See above.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `1054927` mortgage branches not removed → race between CP-name and Borrowers names | High if skipped | Medium | Prerequisite step 0 in DEPLOYMENT_PLAN |
| Manual suffixes removed (Q1) | Medium | Low–Medium | Open question for Rod; possible "lock" column later |
| A Monday native automation reacts to renames | Low | Medium | Check each board's automations before activation |
| First cascade per profile renames many historical Aircall items | High | Low (desired) | Safety cap 150; alert above it |
| Rule drift between the planner and `1215342` / `1228763` / `1232945` | Medium | Low | Rules documented in one place; HANDOVER maintenance note |
| Webhook not fired for API renames | Low | Medium | TEST_PLAN T-04 |
