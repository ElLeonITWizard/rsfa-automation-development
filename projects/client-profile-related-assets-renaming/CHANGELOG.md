---
project_id: CP-RENAME-CASCADE
project_slug: client-profile-related-assets-renaming
title: Client Profile Renaming - Related Assets Renaming - Changelog
document_type: changelog
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: RSFA technical consultant (for Rod Schubert)
created: 2026-10-31
last_modified: 2026-11-02
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001]
related_systems: [Monday.com, Make.com]
---

## Project summary

Cascade Client Profile renames to related items on 10 Monday boards (Mortgage Pipeline and KiwiSaver Pipeline excluded, 2026-11-02); rename Leads when linked to a Client Profile.

## Current status

`Deployed - Pending Validation` — `1054927` changed, `10083674` and `9711585` active (2026-11-02); Monday webhooks (requester) and tests T-01…T-17 pending.

## Change log

| Date | Phase | Change | Reason | Author | Status | Related evidence |
|---|---|---|---|---|---|---|
| 2026-10-31 | Requirements | Project created; original request and clarifications preserved | New request | Claude (with tech@) | Draft | `evidence/original-request.md` |
| 2026-10-31 | Design | Live current-state research (read-only); naming matrix; conflict in `1054927` found | Evidence before design | Claude | Complete | `CURRENT_STATE_REFERENCES.md`, `evidence/exports/` |
| 2026-10-31 | Implementation | Planner, query generator, blueprint generator, 21 unit tests | Candidate build | Claude | Complete (local) | `make/`, `tests/results/2026-10-31-unit.txt` |
| 2026-10-31 | Testing | Live read-only query check; Make schema and module validation | Validation | Claude | Passed / partially verified (TEST_PLAN) | `TEST_PLAN.md` |
| 2026-11-02 | Requirements | Mortgage Pipeline and KiwiSaver Pipeline excluded (boards in progress); `1054927` must not overlap with the cascade; deployment plan approved; Leads back-fill requested | Requester | Claude | Confirmed | `REQUIREMENTS.md` |
| 2026-11-02 | Implementation | Planner and query reduced to 12 lookups on 10 boards; 21/21 tests | Scope change | Claude | Complete | `tests/results/2026-11-02-unit.txt` |
| 2026-11-02 | Deployment | Steps 0–2: backups taken; hook `4480926` created; scenario `10083674` imported **inactive**; `9711585` updated, **inactive** | Approved plan | Claude | Done (no production behaviour change) | `DEPLOYMENT_PLAN.md` |
| 2026-11-02 | Deployment | `1054927` revision prepared (4 overlapping routes, 41 → 21 modules); Leads back-fill dry run (15 renames proposed) | Approved plan | Claude | Superseded by the next rows | `evidence/logs/2026-11-02-leads-backfill-dry-run.md` |
| 2026-11-02 | Deployment | `1054927` change applied (03:15Z, 20 modules removed, verified); `10083674` and `9711585` **activated**. The queued pre-activation challenge was processed (2 operations, status warning, nothing renamed) | Requester confirmation | Claude | Deployed - Pending Validation (Monday webhooks + T-tests pending) | `DEPLOYMENT_PLAN.md` |
| 2026-11-02 | Back-fill | 15 Leads renamed to their Client Profile name (Monday API, one mutation; re-read before writing, response confirmed every new name). Lead `2844833952` excluded (duplicate contact in its CP) | Requester confirmation | Claude | Done | `evidence/logs/2026-11-02-leads-backfill-dry-run.md` |

## Requirement changes

2026-10-31: per-board recalculation, Borrowers rule for mortgages (requester).

## Design changes

2026-10-31: Aircall `Contact Created/Updated` = `No` is the normal state, so the planner skips only `Revert`. Borrowers use `display_value`, because the board-relation `text` field is `null` in the API.

## Implementation changes

None after the build.

## Test changes

None.

## Deployment changes

None.

## Rollback events

None.

## Documentation updates

`rsfa-technical-knowledge`: verified current-state facts recorded in `AUTO-NAMING-001` and the registries (2026-10-31).

## Known limitations

HANDOVER.md.

## Outstanding work

REQUIREMENTS Q1–Q3; DEPLOYMENT_PLAN steps 0–7.
