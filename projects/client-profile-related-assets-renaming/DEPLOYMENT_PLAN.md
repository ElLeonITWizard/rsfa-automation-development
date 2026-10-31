---
project_id: CP-RENAME-CASCADE
project_slug: client-profile-related-assets-renaming
title: Client Profile Renaming - Related Assets Renaming - Deployment Plan
document_type: deployment-plan
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: RSFA technical consultant (for Rod Schubert)
created: 2026-10-31
last_modified: 2026-10-31
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001]
related_systems: [Monday.com, Make.com]
---

## Deployment status

Not started. **Every step below that writes to Make or Monday needs explicit approval of that exact step.**

## Deployment objective

Activate the Client Profile rename cascade and the Lead rename, after removing the conflicting mortgage branches from `1054927`.

## Target environment

Make `eu2.make.com`, organisation `882256` "RSFA", team `85772` "RSFA ". Folder: same folder as `1054927` (TODO: verify the folder ID at deployment). Monday account `rsfa-squad`.

## Exact target resources

| Resource | Action |
|---|---|
| Make scenario `1054927` | Update: delete routes "Mortgage Pipeline Exists" (modules 42, 44, 46, 47, 92, 93) and "Existing Mortgage Exists" (48, 49, 50, 51, 94, 95). Nothing else changes |
| Make hook (new) "CP Rename Cascade Webhook" | Create (gateway-webhook, team `85772`) |
| Make scenario (new) `M.com: Related Assets Renaming after Client Profile Rename (Nov 2026)` | Create from `make/blueprints/cp-rename-cascade.candidate-v1.json` with the new hook ID, **inactive** |
| Make scenario `9711585` | Update its blueprint to `make/blueprints/lead-rename-by-client-profile.candidate-v1.json` (same hook `4335040`), inactive |
| Monday webhook (new) | `create_webhook(board_id: 5024661649, url: <cascade hook URL>, event: change_name)` |
| Monday webhook (new) | `create_webhook(board_id: 2074688480, url: <hook 4335040 URL>, event: change_specific_column_value, config: "{\"columnId\":\"board_relation_mm7c1wcw\"}")` |

## Preconditions

- Rod's answers to REQUIREMENTS Q1/Q2 (Q3 is not blocking).
- Each target board's Monday automations checked for rename reactions (CURRENT_STATE_REFERENCES "Documentation gaps").
- Fictional test items prepared (TEST_PLAN).

## Required approvals

| Approver | Role | Required for | Status |
|---|---|---|---|
| Rod Schubert | Business owner | Naming rules (BR-001…BR-012), Q1, Q2 | Pending |
| tech@rsfa.co.nz | Technical owner | Each production write step below | Pending |

## Backup/export locations

Before step 1: export the full blueprints of `1054927` and `9711585` (Make editor → Export blueprint, or the API) into `make/blueprints/1054927-before-change.json` / `9711585-before-change.json`, **with webhook URLs redacted** before committing. Structural extracts from 2026-10-31 already exist in `evidence/exports/`.

## Deployment window

Business hours NZ, when tech@rsfa.co.nz can watch the first runs (renames are visible to advisers immediately).

## Dependencies

`8732008` active; connection `240128` valid.

## Deployment sequence

| Step | Action | Target | Expected result | Validation | Owner | Status |
|---|---|---|---|---|---|---|
| 0 | Export current production state (full blueprints, scheduling, activation) | `1054927`, `9711585` | Files stored (redacted) | Files present | tech@ | Not started |
| 1 | Create the hook and import the cascade **inactive** | New scenario | Scenario exists, inactive | Editor shows 18 modules (including error handlers); the Code module contains `rename-planner.js` | tech@ | Not started |
| 2 | Update `9711585` with the Lead candidate, still inactive | `9711585` | Inactive, hook `4335040` | Editor review | tech@ | Not started |
| 3 | Remove the two mortgage routes from `1054927` (keep it active) | `1054927` | Only CP, KiwiSaver and insurance branches remain | Diff against the step-0 export: exactly 12 modules removed; T-17 | tech@ | Not started |
| 4 | Activate the cascade, then register the Monday `change_name` webhook | CP board | Challenge answered (T-01) | Monday shows the webhook | tech@ | Not started |
| 5 | Run T-02…T-12, T-15, T-16 with fictional items | — | All Passed | TEST_PLAN updated with results | tech@ | Not started |
| 6 | Activate `9711585`, register the Leads column webhook | Leads board | Challenge answered | T-13, T-14 | tech@ | Not started |
| 7 | Monitoring window | — | No failure emails; no unexpected renames | Make history, daily for 1 week | tech@ | Not started |

## Activation/scheduling state

Both scenarios: instant (webhook), sequential processing. `1054927` stays active throughout (its change removes behaviour only).

## Connection checks

`240128` "My Monday v2 connection - 1": confirm it is valid and can write to the 12 target boards (step 1).

## Monitoring plan

Make execution history of the cascade, `9711585` and `1054927`; failure emails from `8732008`; spot-check 5 renamed profiles after one week.

## Validation checklist

TEST_PLAN T-01…T-17 Passed; AC-001…AC-005 Met.

## Communication plan

Before activation, tell advisers that renaming a Client Profile now renames its Leads, applications, pipelines, policies, questionnaires and calls, and that manual suffixes are not preserved (unless Q1 decides otherwise). Draft message for Rod: HANDOVER.md.

## Pre-deployment confirmation

For each write step: target organisation/team/folder, scenario name, state, module sequence, connection, exact resource, rollback (CLAUDE.md §11 "Pre-write approval").

## Rollback trigger

Any unexpected rename, loop or failure-email storm → ROLLBACK_PLAN.md.

## Post-deployment review

After the monitoring window: update the canonical documentation (`AUTO-NAMING-001`, registries) to describe the validated behaviour.

## Known limitations

See HANDOVER.md.

## Deployment record

| Field | Value |
|---|---|
| Deployed by | |
| Deployment date | |
| Blueprint/flow version deployed | |
| Validation result | |
