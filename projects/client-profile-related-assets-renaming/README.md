# Client Profile Renaming - Related Assets Renaming

## Project summary

| Field | Value |
|---|---|
| Project slug | `client-profile-related-assets-renaming` |
| Project status | Deployed - Pending Validation — `1054927` changed, `10083674` (cascade) and `9711585` (Lead) **active** since 2026-11-02; Monday webhooks and tests pending |
| Requester | RSFA technical consultant, from conversations with Rod Schubert |
| Technical owner | tech@rsfa.co.nz |
| Date opened | 2026-10-31 |
| Target completion date | TODO: verify |

## Business objective

When a Client Profile is renamed, every related item (Leads, Mortgage App, SOP Masterboard, Existing KiwiSaver, Existing Mortgages, insurance, questionnaires, Aircall calls — not the in-progress Mortgage and KiwiSaver Pipelines) follows automatically, each board with its own naming rule. A Lead is renamed as soon as it is linked to a Client Profile.

## Affected systems

Monday.com (13 boards), Make.com.

## Affected canonical automations

`AUTO-NAMING-001`, `AUTO-LEADS-001` (and `AUTO-SP-FOLDER-001` runs in parallel, unchanged).

## Current project phase

Design and local build complete → awaiting design review and Rod's answers (REQUIREMENTS Q1–Q3).

## Next required decision

Q1 (manual suffixes) and Q2 (KiwiSaver / Insurance Pipeline rules); then approval of DEPLOYMENT_PLAN step 0–3.

## Main risks

`1054927` still names mortgages with the Client Profile name (must change before activation); manual suffixes overwritten.

## Open questions

REQUIREMENTS.md "Open questions".

## Approval status

| Gate | Approved by | Date | Status |
|---|---|---|---|
| Requirements | Requester (rules) / Rod: TODO: verify | 2026-10-31 | Pending |
| Design | | | Pending |
| Deployment | Requester | 2026-11-02 | Plan approved; each production write confirmed step by step |

## Project documents

| Document | Purpose | Status |
|---|---|---|
| [REQUIREMENTS.md](./REQUIREMENTS.md) | Confirmed problem, scope and acceptance criteria | Draft |
| [CURRENT_STATE_REFERENCES.md](./CURRENT_STATE_REFERENCES.md) | Current-state evidence (live, 2026-10-31) | Complete |
| [DESIGN.md](./DESIGN.md) | Proposed architecture and data flow | Draft |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Ordered build steps | Draft |
| [TEST_PLAN.md](./TEST_PLAN.md) | Test cases and results | Local tests passed; Make tests planned |
| [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md) | Deployment sequence and approvals | Draft |
| [ROLLBACK_PLAN.md](./ROLLBACK_PLAN.md) | Reversal procedure | Draft |
| [CHANGELOG.md](./CHANGELOG.md) | History of changes | Current |
| [HANDOVER.md](./HANDOVER.md) | Maintenance handover + draft message to Rod | Draft |
| [evidence/original-request.md](./evidence/original-request.md) | Preserved source request | Complete |

## Candidate assets

```text
make/code/rename-planner.js                  Code module body (all naming rules)
make/queries/build_queries.py                generates client-profile.graphql + related-assets.graphql
make/build_blueprints.py                     generates the two candidate blueprints
make/blueprints/cp-rename-cascade.candidate-v1.json
make/blueprints/lead-rename-by-client-profile.candidate-v1.json
tests/rename-planner.test.js                 node tests/rename-planner.test.js
```

## Definition of done

`rsfa-automation-development/CLAUDE.md` §20.

## Project timeline summary

| Milestone | Date | Notes |
|---|---|---|
| Intake + current state | 2026-10-31 | Live read-only research |
| Design + local build | 2026-10-31 | 21/21 unit tests; Make validation |
| Deployment | TODO | Needs approvals |
