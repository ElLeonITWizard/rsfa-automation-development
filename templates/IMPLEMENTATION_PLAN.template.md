---
project_id: <PROJECT-ID>
project_slug: <project-slug>
title: <Project title> - Implementation Plan
document_type: implementation-plan
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: <requester name>
created: <YYYY-MM-DD>
last_modified: <YYYY-MM-DD>
related_automations: []
related_systems: []
---

Related: [DESIGN.md](./DESIGN.md) | [TEST_PLAN.md](./TEST_PLAN.md) | [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md)

## Preconditions

- <design approved>
- <required access confirmed>
- <TODO: verify anything outstanding>

## Required access

| System | Access needed | Requested? | Granted? |
|---|---|---|---|
| <system> | <e.g. scenario editor, board admin> | <Yes \| No> | <Yes \| No> |

## Required exports/backups

- <current production blueprint/flow/schema export to take before changing anything — path under `make/blueprints/`, `power-automate/`, or `monday/`>

## Configuration values required

| Value | Where used | Source |
|---|---|---|
| <e.g. folder ID, board ID> | | <confirmed / TODO: verify> |

## Connection requirements

- <named connection to reuse or create, per platform. Never store the secret value here.>

## Environment-specific values

<Values that differ between test and production, or Not applicable.>

## Implementation sequence

| Step | Action | Target | Owner | Prerequisites | Expected result | Status |
|---|---|---|---|---|---|---|
| 1 | | | | | | <Not started \| In progress \| Blocked \| Complete \| Not applicable> |

## Files to create or modify

- `<path>` — <purpose>

## External resources to create or modify

- <e.g. Make scenario "M.com: ..." — create | Monday column "..." — add>

## Build steps

<Ordered steps for assembling the candidate implementation locally, before any external write. Cross-reference CLAUDE.md section 11 "Pre-write approval" for Make.com.>

## Validation checkpoints

- <what is checked after each major step, before proceeding>

## Review checkpoints

- <point at which a second person or the requester reviews progress>

## Approval gates

| Gate | Required before | Approver |
|---|---|---|
| Design approval | Any build work | <name> |
| Pre-write approval | Any external write | <name> |
| Deployment approval | Production deployment | <name> |

## Rollback preparation

<Confirm ROLLBACK_PLAN.md is ready before this implementation proceeds to deployment.>

## Implementation risks

| Risk | Mitigation |
|---|---|
| | |

## Status tracking

Overall implementation status: <Not started \| In progress \| Blocked \| Complete>

## Responsible person

<name — tech@rsfa.co.nz unless otherwise stated>

## Estimated effort

<rough estimate, or TODO: verify>

## Implementation notes

<Running notes during build. Not a substitute for CHANGELOG.md.>
