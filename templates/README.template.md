---
project_id: <PROJECT-ID>
project_slug: <project-slug>
title: <Project title>
document_type: readme
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: <requester name>
created: <YYYY-MM-DD>
last_modified: <YYYY-MM-DD>
related_automations: []
related_systems: []
---

# <Project title>

## Project summary

| Field | Value |
|---|---|
| Project slug | `<project-slug>` |
| Project status | <Draft \| Requirements Confirmed \| Design Approved \| In Development \| Ready for Testing \| Testing \| Ready for Deployment \| Deployed - Pending Validation \| Validated \| Rolled Back \| On Hold \| Cancelled> |
| Requester | <requester name and role> |
| Technical owner | tech@rsfa.co.nz |
| Date opened | <YYYY-MM-DD> |
| Target completion date | <YYYY-MM-DD or TODO: verify> |

## Business objective

<One or two sentences describing the business outcome this project delivers. Confirmed requirement / Inference — label which.>

## Affected systems

- <System name — Confirmed from canonical documentation | TODO: verify>
- <System name>

## Affected canonical automations

- <Automation ID and name, from `../rsfa-technical-knowledge/knowledge/03_AUTOMATION_REGISTRY.md` — TODO: verify>

## Current project phase

<Name the current phase from the working sequence: Original request → Evidence capture → Requirements analysis → Current-state research → Design → Implementation planning → Testing → Deployment → Validation → Handover → Canonical documentation update>

## Next required decision

<The single next decision or approval blocking progress, and who needs to make it. Not applicable if none.>

## Main risks

- <Risk — likelihood/impact — mitigation or TODO: verify>

## Open questions

- <Question requiring stakeholder clarification>

## Approval status

| Gate | Approved by | Date | Status |
|---|---|---|---|
| Requirements | <name or TODO: verify> | <YYYY-MM-DD> | <Pending \| Approved> |
| Design | | | |
| Deployment | | | |

## Project documents

| Document | Purpose | Status |
|---|---|---|
| [REQUIREMENTS.md](./REQUIREMENTS.md) | Confirmed problem, scope and acceptance criteria | <status> |
| [CURRENT_STATE_REFERENCES.md](./CURRENT_STATE_REFERENCES.md) | Current-state evidence and canonical references | <status> |
| [DESIGN.md](./DESIGN.md) | Proposed architecture and data flow | <status> |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Ordered build steps | <status> |
| [TEST_PLAN.md](./TEST_PLAN.md) | Test cases and results | <status> |
| [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md) | Deployment sequence and approvals | <status> |
| [ROLLBACK_PLAN.md](./ROLLBACK_PLAN.md) | Reversal procedure | <status> |
| [CHANGELOG.md](./CHANGELOG.md) | History of changes | <status> |
| [HANDOVER.md](./HANDOVER.md) | Maintenance handover | <status> |
| [evidence/original-request.md](./evidence/original-request.md) | Preserved source request | <status> |

## Definition of done

Per `CLAUDE.md` section 20 — mark each only when actually true:

- [ ] Requirements confirmed
- [ ] Current state reviewed
- [ ] Design documented
- [ ] Implementation complete
- [ ] Tests executed
- [ ] Production result validated
- [ ] Rollback exists
- [ ] Monitoring defined
- [ ] Stakeholder communication complete
- [ ] Changelog updated
- [ ] Handover complete
- [ ] Canonical documentation updates identified
- [ ] Canonical documentation updated after validation

## Project timeline summary

| Milestone | Date | Notes |
|---|---|---|
| Request received | <YYYY-MM-DD> | |
| Requirements confirmed | | |
| Design approved | | |
| Deployed | | |
| Validated | | |
