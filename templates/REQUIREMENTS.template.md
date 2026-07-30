---
project_id: <PROJECT-ID>
project_slug: <project-slug>
title: <Project title> - Requirements
document_type: requirements
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: <requester name>
created: <YYYY-MM-DD>
last_modified: <YYYY-MM-DD>
related_automations: []
related_systems: []
---

Related: [evidence/original-request.md](./evidence/original-request.md) | [CURRENT_STATE_REFERENCES.md](./CURRENT_STATE_REFERENCES.md) | [DESIGN.md](./DESIGN.md)

## Original business request

<Summarise the request in the stakeholder's own terms. Do not translate it into a technical solution here — see evidence/original-request.md for the literal source.>

## Problem statement

<What is broken, missing, or inefficient today. Evidence label: Confirmed requirement | Inference>

## Desired outcome

<What success looks like from the business side.>

## Stakeholders

| Role | Name |
|---|---|
| Stakeholder / requester | <name> |
| Business owner | <name> |
| Process owner | <name> |
| Technical owner | tech@rsfa.co.nz |

## Scope

### In scope

- <item>

### Out of scope

- <item>

## Functional requirements

| ID | Requirement | Evidence | Status |
|---|---|---|---|
| FR-001 | <requirement statement> | <Confirmed requirement \| Inference \| TODO: verify> | <Draft \| Confirmed> |
| FR-002 | | | |

## Non-functional requirements

| ID | Requirement | Category | Status |
|---|---|---|---|
| NFR-001 | <e.g. processing latency, availability, volume> | <Performance \| Reliability \| Security \| Other> | |

## Business rules

| ID | Rule | Source |
|---|---|---|
| BR-001 | <rule statement> | <where this rule was confirmed> |

## Exceptions

- <known exception to a business rule, and how it should be handled>

## Duplicate prevention

<How duplicate requests, events or records must be detected and handled. Not applicable if genuinely irrelevant.>

## Idempotency

<Whether reprocessing the same input must be safe, and what "safe" means here.>

## Error handling requirements

<What must happen when a dependency fails, a value is missing, or an external call errors.>

## Logging and alerting requirements

<What must be logged, and who must be notified on failure. See CLAUDE.md section 17.>

## Manual recovery requirements

<How an authorised person must be able to recover or reprocess manually.>

## Security and privacy requirements

<Access restrictions, data classification, anything relevant per CLAUDE.md section 13 (technical knowledge repo) and section 15 (test-data rules).>

## Data retention requirements

<How long records, logs or evidence must be retained. TODO: verify if unknown.>

## Acceptance criteria

| ID | Criterion | Linked requirement(s) | Status |
|---|---|---|---|
| AC-001 | <observable, testable statement> | FR-001 | <Planned \| Met \| Not met> |

## Assumptions

- <assumption> — labelled Inference, to be confirmed before design is approved.

## Open questions

| Question | Who can answer | Blocking? |
|---|---|---|
| <question> | <Rod \| Kathleen \| other> | <Yes \| No> |

## Dependencies

- <system, team, or prior project this depends on>

## Constraints

- <technical, budget, timeline or policy constraint>

## Approval status

| Approver | Role | Date | Decision |
|---|---|---|---|
| <name> | <role> | <YYYY-MM-DD> | <Pending \| Approved \| Rejected> |

## Requirement change log

| Date | Requirement ID | Change | Reason | Author |
|---|---|---|---|---|
| <YYYY-MM-DD> | <FR-00x / NFR-00x> | <what changed> | <why> | <name> |
