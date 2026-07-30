---
project_id: <PROJECT-ID>
project_slug: <project-slug>
title: <Project title> - Rollback Plan
document_type: rollback-plan
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: <requester name>
created: <YYYY-MM-DD>
last_modified: <YYYY-MM-DD>
related_automations: []
related_systems: []
---

Related: [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md) | [CHANGELOG.md](./CHANGELOG.md)

## Rollback objective

<Restore the previous known-good state described below, with minimal data impact.>

## Rollback trigger conditions

- <observable condition that means rollback is required, e.g. error rate above X, missing outputs, stakeholder-reported failure>

## Previous known-good state

<Description of exact production state before this deployment: scenario/flow version, board schema, activation state.>

## Backup/export location

- <path to `before-change.json` or equivalent export taken in DEPLOYMENT_PLAN.md>

## Resources affected

- <exact scenario/flow/board/column/function that would be reverted>

## Rollback prerequisites

- [ ] Backup/export confirmed available
- [ ] Decision authority has approved rollback (see below)
- [ ] Downstream impact of rolling back has been considered

## Reversal steps

| Step | Action | Target | Expected result | Validation | Owner | Status |
|---|---|---|---|---|---|---|
| 1 | Deactivate new version | | | | | Not started |
| 2 | Restore previous blueprint/flow/schema | | | | | Not started |
| 3 | Reactivate previous version | | | | | Not started |
| 4 | Validate restored behaviour | | | | | Not started |

## Data reconciliation

<What records created or modified during the failed deployment window need review or correction, or Not applicable.>

## Duplicate cleanup

<How duplicate records created during the failed window are identified and resolved, or Not applicable.>

## Partial-execution handling

<How partially processed items are identified and safely completed or reset, or Not applicable.>

## Validation after rollback

- [ ] Trigger behaves as it did before deployment
- [ ] No duplicate or missing records remain
- [ ] Downstream systems confirmed consistent

## Communication

<Who is notified that a rollback occurred, and when.>

## Residual risks

- <risk that remains even after rollback, or Not applicable>

## Decision authority

<Who can authorise a rollback — see CLAUDE.md section 8 (Approval rules).>

## Platform-specific rollback cases

| Case | Applicable? | Notes |
|---|---|---|
| Scenario creation rollback (delete newly created scenario) | <Yes \| Not applicable> | |
| Scenario update rollback (restore prior blueprint) | | |
| Flow update rollback (restore prior Power Automate version) | | |
| Monday schema rollback (restore prior column/board structure) | | |
| File/document rollback (restore prior SharePoint version) | | |
| Permission rollback (restore prior access) | | |

## Rollback record

| Field | Value |
|---|---|
| Rolled back by | |
| Rollback date | |
| Trigger reason | |
| Validation result | |
