---
project_id: <PROJECT-ID>
project_slug: <project-slug>
title: <Project title> - Test Plan
document_type: test-plan
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: <requester name>
created: <YYYY-MM-DD>
last_modified: <YYYY-MM-DD>
related_automations: []
related_systems: []
---

Use fictional or sanitised data. Do not use real client data unless explicitly authorised and necessary, per CLAUDE.md section 15.

Related: [REQUIREMENTS.md](./REQUIREMENTS.md) | [DESIGN.md](./DESIGN.md) | [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md)

## Test objective

<What this test plan confirms before deployment is authorised.>

## Scope

<Which requirements/acceptance criteria are covered.>

## Out of scope

<What this test plan does not attempt to verify, and why.>

## Test environment

<Sandbox scenario, test board, test folder, etc. Not applicable if testing occurs in a controlled section of production.>

## Test data rules

- Fictional names, sanitised emails, synthetic Monday items only.
- No mortgage, insurance, identification, medical, or financial client data.
- No real call recordings or unredacted transcripts.

## Preconditions

- <what must be true before testing starts, e.g. candidate blueprint imported into test scenario>

## Test cases

| Test ID | Requirement | Category | Scenario | Input | Expected result | Actual result | Status | Evidence |
|---|---|---|---|---|---|---|---|---|
| TC-001 | FR-001 | Standard success path | | | | | Planned | |
| TC-002 | FR-001 | Missing required value | | | | | Planned | |
| TC-003 | FR-001 | Missing optional value | | | | | Planned | |
| TC-004 | | Empty value | | | | | Planned | |
| TC-005 | | Duplicate event | | | | | Planned | |
| TC-006 | | Reprocessing / idempotency | | | | | Planned | |
| TC-007 | | Invalid relationship | | | | | Planned | |
| TC-008 | | External API failure | | | | | Planned | |
| TC-009 | | Rate limit | | | | | Planned | |
| TC-010 | | Partial completion | | | | | Planned | |
| TC-011 | | Error-handler execution | | | | | Planned | |
| TC-012 | | Logging correctness | | | | | Planned | |
| TC-013 | | Alert delivery | | | | | Planned | |
| TC-014 | | Manual recovery | | | | | Planned | |
| TC-015 | | Regression on existing flow | | | | | Planned | |
| TC-016 | | Security / permissions | | | | | Planned | |

Add or mark rows `Not applicable` as the design requires. Category list is the minimum expected coverage per CLAUDE.md section 16 — extend with additional functional and negative/edge cases specific to this project.

## Acceptance criteria mapping

| Acceptance criterion (from REQUIREMENTS.md) | Covered by test ID(s) |
|---|---|
| AC-001 | TC-001 |

## Evidence location

<Path under `tests/results/` or `tests/fixtures/` where run evidence, screenshots or exports are stored.>

## Test result summary

<Filled in after execution: pass/fail counts, blockers, overall readiness for deployment.>

## Remaining risks

- <untested condition or known limitation carried into deployment>
