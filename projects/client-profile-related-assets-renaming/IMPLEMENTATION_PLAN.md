---
project_id: CP-RENAME-CASCADE
project_slug: client-profile-related-assets-renaming
title: Client Profile Renaming - Related Assets Renaming - Implementation Plan
document_type: implementation-plan
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: RSFA technical consultant (for Rod Schubert)
created: 2026-10-31
last_modified: 2026-10-31
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001]
related_systems: [Monday.com, Make.com]
---

## Preconditions

Design reviewed; REQUIREMENTS Q1/Q2 answered.

## Required access

| System | Access needed | Requested? | Granted? |
|---|---|---|---|
| Make | Scenario editor in team `85772`, hook creation | No | TODO: verify |
| Monday | Create/delete webhooks on boards `5024661649`, `2074688480` | No | TODO: verify |

## Required exports/backups

DEPLOYMENT_PLAN step 0.

## Configuration values required

| Value | Where used | Source |
|---|---|---|
| Monday connection `240128` | All GraphQL modules | Confirmed from live system (used by `8410524`, `9447215`) |
| Failure scenario `SCN_8732008` | Error handlers | Confirmed from live system |
| Cascade hook ID | Module 1 (placeholder `0`) | Created at deployment |
| Lead hook `4335040` | `9711585` module 1 | Confirmed from live system |
| `maxRenames` = 150 | Module 6 input | Design choice; adjustable |

## Connection requirements

`240128` only.

## Environment-specific values

None (single production environment).

## Implementation sequence

| Step | Action | Target | Owner | Prerequisites | Expected result | Status |
|---|---|---|---|---|---|---|
| 1 | Current-state research (live, read-only) | Make, Monday | Claude | — | CURRENT_STATE_REFERENCES | Complete |
| 2 | Planner + unit tests | `make/code/rename-planner.js`, `tests/` | Claude | 1 | 21/21 pass | Complete |
| 3 | Query generator + live read check | `make/queries/` | Claude | 1 | Query executes | Complete |
| 4 | Blueprint generator + Make validation | `make/build_blueprints.py`, `make/blueprints/` | Claude | 2, 3 | Valid | Complete (V-05 not testable) |
| 5 | Design review by tech@ and Rod (Q1–Q3) | Docs | tech@ / Rod | 4 | Approved | Not started |
| 6 | Deployment steps 0–7 | Make, Monday | tech@ | 5 + approvals | DEPLOYMENT_PLAN | Not started |

## Files to create or modify

All files in this project folder. Regenerate in this order after any change:

```bash
python3 make/queries/build_queries.py
python3 make/build_blueprints.py
node tests/rename-planner.test.js
```

## External resources to create or modify

DEPLOYMENT_PLAN "Exact target resources".

## Build steps

As above. When importing into Make, replace the hook placeholder (`0`) of the cascade with the new hook.

## Validation checkpoints

TEST_PLAN V-01…V-05 (done), T-01…T-17 (planned).

## Review checkpoints

Design review (step 5); diff of `1054927` before/after (DEPLOYMENT_PLAN step 3).

## Approval gates

| Gate | Required before | Approver |
|---|---|---|
| Design approval | Any build in Make | tech@rsfa.co.nz + Rod (naming rules) |
| Pre-write approval | Each external write | tech@rsfa.co.nz |
| Deployment approval | Activation | tech@rsfa.co.nz |

## Rollback preparation

ROLLBACK_PLAN.md; step-0 exports.

## Implementation risks

| Risk | Mitigation |
|---|---|
| Editing the query or planner by hand in Make makes Git and production drift apart | Always edit here, regenerate, re-import |
| The planner runs differently in Make's runtime than in Node | U-01 runs it in a Make-style wrapper; first Make test T-02 |

## Status tracking

CHANGELOG.md.

## Responsible person

tech@rsfa.co.nz.

## Estimated effort

Deployment and tests: about half a day with prepared fictional items (Inference).

## Implementation notes

The Code module output is `{{6.result.*}}` (Confirmed: the module schema returns `result`).
