---
project_id: CP-RENAME-CASCADE
project_slug: client-profile-related-assets-renaming
title: Client Profile Renaming - Related Assets Renaming - Rollback Plan
document_type: rollback-plan
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: RSFA technical consultant (for Rod Schubert)
created: 2026-10-31
last_modified: 2026-10-31
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001]
related_systems: [Monday.com, Make.com]
---

## Rollback objective

Stop all automatic renaming introduced by this project and return `1054927` and `9711585` to their pre-change state.

## Rollback trigger conditions

Unexpected renames, a rename loop, repeated failure emails, an adviser complaint about lost names, or failed validation tests.

## Previous known-good state

- `1054927`: active, full blueprint exported at DEPLOYMENT_PLAN step 0 (structural extract `evidence/exports/1054927-before-change.redacted.json`).
- `9711585`: inactive, webhook module only (`evidence/exports/9711585-before-change.redacted.json`).
- No cascade scenario; no Monday webhook on Leads `board_relation_mm7c1wcw`; one existing `change_name` webhook on Client Profiles (`23873815`, not ours — do not delete).

## Backup/export location

`make/blueprints/*-before-change.json` (step 0), Make's own scenario version history.

## Resources affected

See DEPLOYMENT_PLAN "Exact target resources".

## Rollback prerequisites

Make editor access; Monday admin (to delete webhooks).

## Reversal steps

1. **Deactivate** the cascade scenario (immediate stop; the webhook queue keeps incoming events, which can then be deleted).
2. **Deactivate** `9711585`.
3. Delete the two Monday webhooks created in steps 4 and 6 (by ID, recorded at creation). **Never delete `23873815` or other existing webhooks.**
4. Restore `1054927` from the step-0 export (or Make version history) only if its change itself is the problem. Note: restoring it brings back the CP-name rule for mortgages.

## Data reconciliation

Renames are not reverted automatically. The previous name of every item is in the cascade's execution history (module 5 output, item `name`). Restore the affected items manually or with a one-off scenario (separate approval). The history retention period limits this (TODO: verify the plan's retention).

## Duplicate cleanup

Not applicable (no items are created).

## Partial-execution handling

A run stopped mid-way leaves some items renamed and others not. A `manual_rerun` completes it; a rollback leaves it as is (names remain valid by the rule).

## Validation after rollback

Rename a test CP: no related item changes; the SharePoint folder still renames (Power Automate).

## Communication

Tell tech@rsfa.co.nz and Rod which profiles were affected (IDs from the execution history).

## Residual risks

Names already changed stay changed until manually restored.

## Decision authority

tech@rsfa.co.nz may deactivate immediately; Rod is informed.

## Platform-specific rollback cases

Make: deactivate / restore a version. Monday: `delete_webhook(id: …)`.

## Rollback record

| Date | Trigger | Steps executed | Result |
|---|---|---|---|
| | | | |
