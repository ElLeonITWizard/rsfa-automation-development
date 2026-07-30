---
project_id: <PROJECT-ID>
project_slug: <project-slug>
title: <Project title> - Deployment Plan
document_type: deployment-plan
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: <requester name>
created: <YYYY-MM-DD>
last_modified: <YYYY-MM-DD>
related_automations: []
related_systems: []
---

Related: [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | [TEST_PLAN.md](./TEST_PLAN.md) | [ROLLBACK_PLAN.md](./ROLLBACK_PLAN.md)

## Deployment status

<Draft \| Requirements Confirmed \| Design Approved \| In Development \| Ready for Testing \| Testing \| Ready for Deployment \| Deployed - Pending Validation \| Validated \| Rolled Back \| On Hold \| Cancelled>

A change is not complete at `Deployed - Pending Validation` — see "Post-deployment review" below.

## Deployment objective

<What this deployment changes in production, in one or two sentences.>

## Target environment

<Production, or a named test/sandbox environment if this is a staged rollout.>

## Exact target resources

- <exact scenario name and ID / flow name / board name and ID / function name>

## Preconditions

- Design approved.
- Tests passed (see TEST_PLAN.md).
- Rollback plan ready (see ROLLBACK_PLAN.md).

## Required approvals

| Approver | Role | Required for | Status |
|---|---|---|---|
| <name> | | <e.g. production write, billing change> | <Pending \| Approved> |

Cross-check against CLAUDE.md section 8 (Approval rules) for actions that always require explicit approval.

## Backup/export locations

- <path under `make/blueprints/before-change.json`, `power-automate/`, or `monday/` — taken before deployment>

## Deployment window

<Proposed date/time and why, e.g. outside business hours, low-traffic period. TODO: verify if not yet scheduled.>

## Dependencies

- <other scenario, flow, board or system this deployment depends on or affects>

## Deployment sequence

| Step | Action | Target | Expected result | Validation | Owner | Status |
|---|---|---|---|---|---|---|
| 1 | Export current production state | | | | | Not started |
| 2 | Deploy candidate | | | | | Not started |
| 3 | Activate / schedule | | | | | Not started |
| 4 | Validate production behaviour | | | | | Not started |

## Activation/scheduling state

<Before and after: active/inactive, schedule interval, immediate vs manual trigger.>

## Connection checks

- <confirm each connection used exists and is authorised, without exposing secret values>

## Monitoring plan

<What is watched during and after deployment, for how long, and who is watching. See CLAUDE.md section 17.>

## Validation checklist

- [ ] Trigger fires as expected
- [ ] Output matches DESIGN.md
- [ ] Downstream systems receive expected data
- [ ] Error handler behaves as designed
- [ ] Logging appears as designed
- [ ] No unexpected duplicate records created

## Communication plan

<Who is notified before/after deployment, and how — e.g. Slack message to Rod.>

## Pre-deployment confirmation

- [ ] Exact target confirmed
- [ ] Backup/export taken
- [ ] Required approval obtained
- [ ] Test completion confirmed
- [ ] Rollback plan ready
- [ ] Monitoring plan ready

## Rollback trigger

<Condition that would trigger a rollback. Full procedure lives in ROLLBACK_PLAN.md.>

## Post-deployment review

<Confirmation that production behaviour was actually validated, with date and evidence reference. Do not mark Validated until this is complete.>

## Known limitations

- <limitation accepted for this deployment, or Not applicable>

## Deployment record

| Field | Value |
|---|---|
| Deployed by | |
| Deployment date | |
| Blueprint/flow version deployed | |
| Validation result | |
