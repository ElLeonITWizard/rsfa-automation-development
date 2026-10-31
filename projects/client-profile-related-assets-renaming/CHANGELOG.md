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
last_modified: 2026-10-31
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001]
related_systems: [Monday.com, Make.com]
---

## Project summary

Cascade Client Profile renames to related items on 12 Monday boards; rename Leads when linked to a Client Profile.

## Current status

`In Development` — design and candidate assets complete locally; nothing deployed.

## Change log

| Date | Phase | Change | Reason | Author | Status | Related evidence |
|---|---|---|---|---|---|---|
| 2026-10-31 | Requirements | Project created; original request and clarifications preserved | New request | Claude (with tech@) | Draft | `evidence/original-request.md` |
| 2026-10-31 | Design | Live current-state research (read-only); naming matrix; conflict in `1054927` found | Evidence before design | Claude | Complete | `CURRENT_STATE_REFERENCES.md`, `evidence/exports/` |
| 2026-10-31 | Implementation | Planner, query generator, blueprint generator, 21 unit tests | Candidate build | Claude | Complete (local) | `make/`, `tests/results/2026-10-31-unit.txt` |
| 2026-10-31 | Testing | Live read-only query check; Make schema and module validation | Validation | Claude | Passed / partially verified (TEST_PLAN) | `TEST_PLAN.md` |

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
