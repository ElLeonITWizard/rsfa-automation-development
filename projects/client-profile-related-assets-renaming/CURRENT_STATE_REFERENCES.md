---
project_id: CP-RENAME-CASCADE
project_slug: client-profile-related-assets-renaming
title: Client Profile Renaming - Related Assets Renaming - Current State References
document_type: current-state-references
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: RSFA technical consultant (for Rod Schubert)
created: 2026-10-31
last_modified: 2026-10-31
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001, AUTO-SP-FOLDER-001, AUTO-FORMS-001, AUTO-MASTERBOARD-001, AUTO-AIRCALL-001]
related_systems: [Monday.com, Make.com, Power Automate, SharePoint]
---

All "Confirmed from live system" facts below were read on **2026-10-31** with read-only access: Make API / Make MCP (`scenarios_list`, scenario blueprints, `hooks_get`) and Monday GraphQL reads (board columns, `webhooks(board_id)`, sample items). No execution was triggered and nothing was written. Client names seen in samples are not reproduced here.

## Summary of current state

Every board names its items with its own rule, set **at creation** or **on a specific column change**. There is **no automation that reacts to a Client Profile being renamed** apart from the Power Automate SharePoint folder rename. The only cascade today starts from a **Contact rename** (`1054927`), and it covers some boards, uses the wrong rule for the mortgage boards, and skips Leads, Mortgage App, the questionnaires and Aircall.

## Naming matrix (current behaviour)

| Board | ID | Current naming rule | Set by (live) | Relation used to reach it | Evidence |
|---|---|---|---|---|---|
| Client Profiles | `5024661649` | Contacts names, `", "` → `" &"` (`board_relation38`) | `1054927` (Contact renamed), `1054932` (participants added; only when the name has no `&` or more than 1 contact) | — | Confirmed from live system |
| Leads | `2074688480` | Client Profile name | `8800779` module 139, **at creation only** | `board_relation_mm7c1wcw` "Client Profiles" (no reflection on the CP board) | Confirmed from live system |
| ✍ Mortgage App/SOP | `5025483251` | Client Profile name (the Contact's `Associated Client Profile` text) | `8410524` module 491, at creation | `board_relation_mm6fr9y4` "Client Profiles" | Confirmed from live system |
| SOP Masterboard (registry: "Masterboard: End Forms") | `5026186805` | Client Profile name, with household guards | `10037840` "RSFA – End Forms: Client Profile link and record name sync", **scheduled every 900 s**, reads the first 500 items only | `board_relation_mm8fc6yd` "Client Profile" | Confirmed from live system |
| ❓️Insurance Questionnaire | `5025365501` | Insured Party contact name | `9447215` module 197, at submission | `board_relation_mktbzvj0` "Insured Party" → Contacts | Confirmed from live system |
| 🐖 KiwiSaver Questionnaire | `5026459551` | Contact name | `9447215` module 195, at submission | `board_relation_mm09dn6v` "Contact" | Confirmed from live system |
| 💲Mortgage Pipeline | `5025201889` | Borrowers, `", "` → `" &"` | `1232945` (Borrowers changed). **Overwritten with the CP name by `1054927`** on Contact rename | `board_relation_mkyercdt` "Client Profiles"; Borrowers `board_relation_mkyf123a` | Confirmed from live system |
| ✅️ Existing Mortgages | `5024672364` | Borrowers, `", "` → `" &"` | `1228763` (Borrowers changed). **Overwritten with the CP name by `1054927`** on Contact rename | `connect_boards7` "Client Profiles"; Borrowers `board_relation_mkyjjs0w` | Confirmed from live system |
| ➕Insurance Pipeline | `5025201920` | Policy Owners joined `" & "` + `" \| " + provider` (`color_mkxpxs6j`) | `1215342` (webhook; also called by `1054927` for each linked policy) | `board_relation_mkxpqnck` "Client Profiles (Owners)"; owners `board_relation_mkyjddgg` | Confirmed from live system |
| ✔️ Existing Insurance | `5024672437` | Policy Owners joined `" & "` + `" \| " + provider` (`label9`) | `1215342` (as above) | `board_relation_mkyhtdhk` "Client Profiles"; owners `board_relation_mkyjvgra` | Confirmed from live system |
| 📈 KiwiSaver Pipeline | `5025201954` | Client Profile name | `1054927` (Contact renamed). Naming at creation by `9756260`: TODO: verify | `board_relation_mm6qp8dt` "Client Profiles" and legacy `board_relation_mkxpqnck` | Confirmed from live system (1054927); creation rule unknown |
| Existing KiwiSaver | `5024672484` | Client Profile name | `1054927` | `board_relation_mktzw3h0` "Client Profiles" | Confirmed from live system |
| 📞 Aircall: VOIP Call Board | `5026308494` | Linked contact name. `Unknown` when unmatched. Older items keep the legacy `Aircall new contact` even when linked | `9869454`, `10010457` (and the Aircall call-matching flow) | `board_relation_mm0pghp5` "Network/Client Contact" (Contacts `2074688484` or network `5031819688`) | Confirmed from live system |
| SharePoint client folder | — | Client Profile name | Power Automate `SharePoint - Rename Client Folder from Monday.com` | — | Confirmed from canonical documentation (`AUTO-SP-FOLDER-001`) |

Status column `color_mm7hf0xh` "Contact Created/Updated" on Aircall: `No` is the normal state of a matched call; `Yes` = contact created/updated by `9869454`; `Revert` = being undone by `10010457` (Confirmed from live system: labels and sample values).

## Reference table

| Reference | Type | Path or ID | Evidence status | Why relevant |
|---|---|---|---|---|
| Client, Deal and Policy Naming Synchronisation | Automation | `../../../rsfa-technical-knowledge/knowledge/automations/make/AUTO-NAMING-001-record-naming-sync.md` | Confirmed from canonical documentation (partial) | Existing naming family this project extends |
| Lead to Contact and Client Profile Creation | Automation | `../../../rsfa-technical-knowledge/knowledge/automations/make/AUTO-LEADS-001-lead-client-profile-creation.md` | Confirmed from canonical documentation | Lead naming at creation |
| Client folder lifecycle | Automation | `../../../rsfa-technical-knowledge/knowledge/automations/power-automate/AUTO-SP-FOLDER-001-client-folder-lifecycle.md` | Confirmed from canonical documentation | Parallel reaction to CP rename (SharePoint) |
| Failure email component | Component | `../../../rsfa-technical-knowledge/knowledge/automations/make/components/COMP-MAKE-ERROR-001-failure-email.md` | Confirmed from canonical documentation | Error notification used by the candidates |
| Monday boards registry | Registry | `../../../rsfa-technical-knowledge/knowledge/04_MONDAY_BOARDS_REGISTRY.md` | Confirmed from canonical documentation | Board IDs |
| Live structural extracts | Export | `evidence/exports/1054927-before-change.redacted.json`, `evidence/exports/9711585-before-change.redacted.json` | Confirmed from live system (2026-10-31, structural extract, redacted) | Before-change state |

## Affected system IDs

Monday.com, Make.com (`eu2.make.com`, organisation `882256` "RSFA", team `85772`), Power Automate (unchanged), SharePoint (unchanged).

## Affected automation IDs

`AUTO-NAMING-001` (extended), `AUTO-LEADS-001` (Lead naming), `AUTO-SP-FOLDER-001` (parallel, unchanged).

## Make scenario names and IDs

| ID | Exact name | State (2026-10-31) | Relevance |
|---|---|---|---|
| `1054927` | M.com: CP and Deals Renaming after Contact Renaming | Active, last edit 2026-10-25 | Contact rename → CP + Mortgage Pipeline + Existing Mortgage + KiwiSaver Pipeline + Existing KiwiSaver (all named from the CP) + insurance via `1215342` webhook. **Needs a change** (see DESIGN §Prerequisite) |
| `1054932` | M.com: Updates profile name when participants added | Active | Renames the CP; that rename will now cascade |
| `1215342` | M.com: Renaming after Insurance Policy Added or Owner/Provider Change (Feb 2026) | Active | Owners \| Provider rule (mirrored by the planner) |
| `1228763` | M.com: Update Existing Mortgages Name from Borrowers (Dec 25) | Active | Borrowers rule |
| `1232945` | M.com: Update Mortgage Pipeline Name from Borrowers (Dec25) | Active | Borrowers rule. **Not listed in AUTO-NAMING-001** |
| `8800779` | M.com: Creating Contact and Client Profile after Lead was Added (Mar 2026) | Active, last edit 2026-10-31 | Names the Lead at creation |
| `8410524` | M.com: New item in Mortgage App Copy to Masterboard End Forms (Jan 26) | Active | Names Mortgage App items |
| `9447215` | M.com: New Form Submission in IQ/MA/KQ (Jun 2026) | Active | Names IQ / KQ items |
| `10037840` | RSFA – End Forms: Client Profile link and record name sync | Active, scheduled 900 s | Keeps SOP Masterboard name and CP link in sync (polling) |
| `9711585` | M.com: Lead Rename by ClientProfile (Mar 2026) | **Inactive**; only a webhook module; hook `4335040` "New Lead webhook" | Unfinished shell for the Lead fix; reused by this project |
| `9869454`, `10010457`, `9627714` | Aircall contact creation / revert / contact change | Active | Aircall naming and the `Revert` state |
| `9911427` | RSFA Sync – Renames, group moves and archiving (masterboard ↔ personal boards) | Active | Watches renames on boards `5031643614`, `5031697602`, `5031702324` only: not touched by this project |
| `8732008` | Outlook: Email Notification after Failed Scenario | Active | Error notifications |
| `8731317` | M.com to Macroforge: Trigger Macroforge End Forms Filling Flow (Feb 2026) | Active | Proves the `code` (Code module) app runs on RSFA's Make plan |

## Power Automate flow names

`SharePoint - Rename Client Folder from Monday.com` (workflow `8f6285cd-0f9e-f011-bbd2-000d3ae0ae9d`, per canonical docs). Unchanged.

## Monday board names and IDs

See the naming matrix.

## Monday column titles and IDs

See the naming matrix. Client Profiles relation columns (for reference): `board_relation38` Contacts, `board_relation_mktdj4ny` Leads, `board_relation_mm6fn506` Mortgage App/SOP, `board_relation_mkyebcmw` Mortgage Pipeline, `board_relation_mkycc37a` Existing Mortgage, `board_relation_mkye6rvb` Insurance Pipeline, `board_relation_mkyep8n0` Existing Insurance, `board_relation_mkye5k1h` / `board_relation_mm6qmtk6` KiwiSaver Pipeline, `board_relation_mkyeyfwe` Existing KiwiSaver. The candidate does not rely on them: it searches each board by its own link column (reverse lookup), because several links have no reflection on the CP board (for example Leads → CP).

## SharePoint locations

Not changed by this project.

## Slack channels or threads

TODO: verify — the Rod threads behind this request were not supplied.

## Related incidents

None found.

## Related decisions

`ADR-001-deprecate-monday-workflows.md` (Make preferred over Monday Workflows).

## Related playbooks

None specific.

## Related schemas

None in `knowledge/schemas/` (the folder does not exist yet in the canonical repo).

## Current exports

`evidence/exports/*-before-change.redacted.json` (structural extracts only; full backups must be exported at deployment).

## Current production evidence

Monday webhooks (Confirmed from live system, 2026-10-31):

- Client Profiles `5024661649`: `create_item` ×3, **`change_name` (`23873815`)**, `change_specific_column_value` on `board_relation38`, `change_specific_column_value` on `people`, `item_deleted`. Webhook targets are not readable through the API. The `change_name` webhook is probably the Power Automate folder rename (Inference).
- Leads `2074688480`: `create_item`, `change_specific_column_value` on `dropdown_mm7dakdk`. **No webhook on `board_relation_mm7c1wcw`**, so `9711585`'s hook receives nothing today.

Drift samples (Confirmed from live system, small samples, names not reproduced):

- Leads: 3 of the 6 first items read are named after one applicant, while their linked Client Profile has both applicants.
- Aircall: items linked to a contact are still named `Aircall new contact` (created Feb 2026).
- Mortgage Pipeline: one item carries a manual suffix after the borrower names. The automatic rule would remove it (see REQUIREMENTS open question Q1).

Query validation: the generated related-assets query (`make/queries/related-assets.graphql`) was executed read-only against a real Client Profile and returned matching Mortgage App, SOP Masterboard and Aircall items. Reverse filtering on board-relation columns (`any_of` with item IDs) works. `compare_value: [0]` returns no items without an error.

## Historical evidence

`1235121` "M.com: Rename mortgages", `1215312` "M.com: Updates policy name when policy owners are added/removed", `5543762` "M.com: Calls Name; Client Contacts Changes": inactive predecessors.

## Conflicts between sources

| Discrepancy | Source A | Source B | Resolution status |
|---|---|---|---|
| Mortgage naming rule | `1228763` / `1232945`: Borrowers | `1054927`: CP name on Contact rename | Resolved by requester 2026-10-31: **Borrowers**. `1054927` needs a change (approval) |
| Board `5026186805` name | Registry: "Masterboard: End Forms" | Live: "SOP Masterboard" | Canonical registry update needed |
| AUTO-NAMING-001 scenario list | Lists 4 scenarios | Live: also `1232945` (active), `10037840` (SOP Masterboard naming), `9711585` (inactive shell) | Canonical doc update needed |
| AUTO-NAMING-001 says naming rules are unconfirmed | "No field-level naming-format rules confirmed" | Live blueprints confirm the formulas above | Canonical doc update needed |

## Documentation gaps

- KiwiSaver Pipeline naming at creation (`9756260`).
- Target of Monday webhook `23873815`.
- Whether any **Monday native automation** reacts to item renames on the 12 target boards (TODO: verify in each board's Automations centre).
- Make execution-history retention on RSFA's plan (affects name rollback).

## Live verification still required

See TEST_PLAN.md (integration tests with fictional items).

## Evidence retrieval instructions

- Make: `GET https://eu2.make.com/api/v2/scenarios/<id>/blueprint` (or the Make MCP `scenarios_get`), read-only.
- Monday: `query { webhooks(board_id: <id>) { id event config } }` and `boards(ids: [...]) { columns(types: [board_relation, mirror]) { id title settings_str } }`.
