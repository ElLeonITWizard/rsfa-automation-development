---
project_id: CP-RENAME-CASCADE
project_slug: client-profile-related-assets-renaming
title: Client Profile Renaming - Related Assets Renaming - Handover
document_type: handover
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: RSFA technical consultant (for Rod Schubert)
created: 2026-10-31
last_modified: 2026-11-02
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001]
related_systems: [Monday.com, Make.com]
---

> Draft handover written at design stage. Nothing is deployed; complete it after validation.

## Final validated behaviour

Not yet validated. Intended behaviour: DESIGN.md.

## Business purpose

Keep every item that belongs to a client recognisable under the client's current name.

## Systems involved

Monday.com, Make.com.

## Canonical automation IDs

`AUTO-NAMING-001` (to be extended after validation).

## Exact Make scenario IDs

Cascade: TBD at creation. Lead: `9711585`. Changed: `1054927`.

## Exact Monday boards and columns

REQUIREMENTS BR-001…BR-012; column IDs in `make/queries/build_queries.py`.

## Trigger

Monday `change_name` on Client Profiles; Monday column change on Leads `board_relation_mm7c1wcw`.

## Inputs and outputs

DESIGN.md.

## Main logic

`make/code/rename-planner.js` — `SPECS` lists each lookup (board + rule), and `target()` holds the four rules (`cp`, `borrowers`, `owners`, `contact`).

## Connections

Monday `240128`.

## Scheduling

Instant, sequential.

## Error handling

Failure email `8732008`; abort and skip codes in DESIGN.md.

## Logging

Make execution history only.

## Alerts

tech@rsfa.co.nz.

## First checks when this automation fails

1. Read the failure email: abort code or board/item IDs.
2. Open the run in Make history: module 6 `result.skipped` explains every item left unchanged.
3. Check that the Monday webhook still exists (`webhooks(board_id: 5024661649)`).

## Manual recovery

Re-run one profile by POSTing to the cascade hook (URL in Make, never in Git):

```json
{"event": {"type": "manual_rerun", "boardId": 5024661649, "pulseId": 1234567890}}
```

## Support procedure

Same as other Make automations (`knowledge/08_TICKET_INVESTIGATION_PLAYBOOK.md`).

## Troubleshooting

| Symptom | Likely cause | Action |
|---|---|---|
| Profile renamed, nothing else changed | Webhook missing or scenario inactive | Check the Monday webhook and the scenario state; then `manual_rerun` |
| A mortgage item gets the CP name back | `1054927` mortgage routes restored | Re-apply the `1054927` change |
| `TOO_MANY_RENAMES` email | More than 150 items to rename (usually Aircall history) | Review the count; raise `maxRenames` for one manual run if expected |
| `MISSING_ALIAS_…` | Query edited in Make without the planner | Re-import the generated blueprint |
| Item kept its name | `skipped` reason (multiple profiles, no Borrowers, …) | Fix the item's links; re-run |

## Maintenance rules (learned in production, 2026-11-02)

- Never write double curly braces in `rename-planner.js`, not even in comments: Make evaluates them inside the Code field, and the module silently returns an empty result. A unit test enforces this.
- Keep sequential processing **off** on `10083674` and `9711585`: otherwise Make answers Monday's webhook challenge itself, and webhook creation or renewal fails.
- Execution details (module outputs) are not readable through the Make API in this account; use the Make UI, or a temporary probe as described in CHANGELOG.

## Test fixtures kept

`2896920831` "Existing KiwiSaver" and `2896920905` "Existing Mortgages" test items, linked to test CP `2519813525`. Kept for regression tests; archive them when they are no longer needed.

## Known limitations

- Manual suffixes in names are overwritten (REQUIREMENTS Q1).
- More than 500 items per lookup: only the first 500 are processed; an alert is sent.
- The insurance rule mirrors `1215342`, and the mortgage rule mirrors `1228763`/`1232945`. If those scenarios change their format, update `rename-planner.js` too.
- Previous names are recoverable only while Make history is retained.

## Security considerations

No client names in alerts; webhook URLs only in Make.

## Required permissions

Make editor; Monday webhook admin; the connection's write access to the 12 boards.

## Deployment history

None.

## Rollback summary

ROLLBACK_PLAN.md.

## Test evidence

`tests/results/`.

## Outstanding actions

DEPLOYMENT_PLAN steps 0–7; REQUIREMENTS Q1–Q3; canonical documentation update after validation.

## Canonical documentation updated

Current-state facts verified on 2026-10-31 were recorded in `rsfa-technical-knowledge` (`AUTO-NAMING-001`, registries). The proposed behaviour will be added after validation.

## Ownership

tech@rsfa.co.nz.

## Handover acceptance

| Accepted by | Role | Date |
|---|---|---|
| | | |

## Draft message for Rod (English)

> Hi Rod — quick update on the Client Profile renaming work.
>
> Today, renaming a Client Profile only renames its SharePoint folder. Its Leads, applications, policies, questionnaires and Aircall calls keep their old names. Leads in particular keep whatever name they had when they were created.
>
> We've set up one Make automation that runs whenever a Client Profile's name changes. It renames every related item using each board's naming rule:
> - the Client Profile name for Leads, Mortgage App, SOP Masterboard and Existing KiwiSaver;
> - the Borrowers for Existing Mortgages;
> - "Policy Owners | Provider" for insurance;
> - the contact's name for the Insurance and KiwiSaver questionnaires and for Aircall calls.
>
> The Mortgage Pipeline and KiwiSaver Pipeline boards are left out for now, because they are still being set up. A second small automation renames a Lead as soon as it is linked to a Client Profile. We'll also bring the existing Leads in line with their Client Profile names.
>
> Everything is built and checked on our side, and we'll test it with dummy records before switching it on. Two quick questions:
> 1. Some item names have extra notes typed after the client name. The automation would remove them. Is that OK, or should we be able to "lock" a name?
> 2. Can you confirm Existing KiwiSaver items should carry the Client Profile name, and Insurance Pipeline items the same "Owners | Provider" format as Existing Insurance?
