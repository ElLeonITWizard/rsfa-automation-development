---
project_id: CP-NAME-FROM-CONTACTS
project_slug: client-profile-name-from-contacts
title: Client Profile Name from Contacts - Current State References
document_type: current-state-references
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
created: 2026-11-03
last_modified: 2026-11-03
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001, AUTO-SP-FOLDER-001]
---

All facts are **Confirmed from live system, 2026-11-03** (Monday activity log + GraphQL reads; Make blueprints and execution logs; read-only) unless labelled otherwise.

## Summary of current state

The only automation that names a Client Profile from its Contacts is `1054932` "M.com: Updates profile name when participants added". It listens to **changes** of the Contacts column (`board_relation38`) and only renames when the name has no "&" **or** more than one contact is linked. Two gaps result:

1. **Profile created with contacts already set** (internal SuperForm): Monday emits no column-change event for values set at creation, so `1054932` never runs. The profile keeps the form's placeholder name "Incoming form answer". The SharePoint folder is created with that name and is never renamed, because the name never changes.
2. **Contact removed**: `1054932` runs but its filter blocks the rename ("A & B" contains "&" and only one contact is left).

Neither gap is related to the rename cascade (`10083674`), which reacts to Client Profile **name** changes and worked when the name was changed.

## Incident timeline (UTC, 2026-11-03)

| Time | Event | Actor |
|---|---|---|
| 04:09:53 | CP `2897989144` created as "Incoming form answer", **with** `board_relation38` = 1 contact in the create payload | SuperForm (user `46759817` "RSFA IT Desk") |
| 04:10:23 | SharePoint folder created as `Incoming form answer_2897989144` (link5) | Power Automate (~30 s after creation) |
| 04:10:55 | Contact removed from CP `2519772272` (2 → 1 contact) | Rod |
| 04:10:58 | `1054932` runs (2 ops): reads the item, filter blocks the rename | Make |
| 04:13:3x | CP `2519772272` renamed manually | Rod |
| 04:13:38 | Cascade `10083674` runs (7 ops): 2 Aircall items renamed | Make |
| 04:13:51 | SharePoint folder of `2519772272` renamed | Power Automate |

## The three ways a Client Profile is created

| Path | How the item is created | Contacts at creation | Name at creation | Events emitted |
|---|---|---|---|---|
| **Manual** (main table) | Adviser types a name | Usually none; may be linked later | Typed name | `create_pulse`; later `update_column_value` (`board_relation38`) when contacts are linked |
| **Internal SuperForm** "SF: Profile Opening" | Form submission | **Yes**, in the create payload | "Incoming form answer" (SuperForm default) | `create_pulse` only |
| **Leads board** (`8800779` "M.com: Creating Contact and Client Profile after Lead was Added (Mar 2026)") | Module 9 `createItem2V2` | 0 or 1 contact (`ifempty(3.id; emptystring)`) | Applicant name typed in the Lead (`93.name` or the second-applicant text column) | `create_pulse`; then module 11 sets **all** contacts → `update_column_value` (`board_relation38`). Module 204 waits 5 s, module 169 reads the CP name, module 139 copies it to the Lead and links the Lead to the CP |

`8800779` therefore depends on `1054932` renaming the profile **within 5 seconds** of module 11. When it is slower, the Lead gets the applicant's name only. This explains the Lead drift corrected on 2026-11-02 (Inference, consistent with timings).

## Make scenario names and IDs

| ID | Name | State | Relevance |
|---|---|---|---|
| `1054932` | M.com: Updates profile name when participants added | Active; Make-managed Monday trigger (hook `513569`; Monday webhook `23873818`, `change_specific_column_value` on `board_relation38`) | To be **replaced** by the new scenario |
| `8800779` | M.com: Creating Contact and Client Profile after Lead was Added (Mar 2026) | Active (last edit 2026-10-31) | Creates CPs; must not be blocked |
| `1054927` | M.com: CP and Deals Renaming after Contact Renaming | Active | Renames the CP on **Contact** rename (same format); unaffected |
| `10083674` | M.com: Related Assets Renaming after Client Profile Rename (Nov 2026) | Active | Runs after any CP rename (assets follow) |
| `9711585` | M.com: Lead Rename by ClientProfile (Mar 2026) | Active | Re-aligns the Lead when it is linked to its CP |

## Power Automate

`SharePoint - Client Folder Creation from Monday.com` (on CP creation) and `SharePoint - Rename Client Folder from Monday.com` (on CP `change_name`, Monday webhook `23873815`, folder located by pulseID). What happens when the rename fires **before** the folder exists is unknown (AUTO-SP-FOLDER-001 §15, TODO: verify). The design therefore waits 90 s on creation.

## Monday board and columns

Client Profiles `5024661649`: `name`, `board_relation38` "Contacts", `link5` "SP folder". Existing webhooks: `create_item` ×3, `change_name` `23873815` (PA) and `41427237` (cascade), `change_specific_column_value` `board_relation38` (`23873818`, 1054932) and `people`, `item_deleted`.

## Naming format (current rule)

`replace(Contacts.text; ","; " &")` in `1054932` and `1054927`. In the API, `display_value` returns the same "A, B" text in link order (verified 2026-10-31 on other boards).

## Conflicts between sources

| Discrepancy | Source A | Source B | Status |
|---|---|---|---|
| `AUTO-LEADS-001` says the Leads intake creates the CP "with the correct name" | Requester / canonical doc | `8800779` creates it with the applicant name and relies on `1054932` within 5 s | Recorded; the new scenario makes this deterministic |

## Live verification still required

TEST_PLAN.md (all three creation paths, plus SharePoint folder naming).
