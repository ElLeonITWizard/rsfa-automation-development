---
project_id: CP-NAME-FROM-CONTACTS
project_slug: client-profile-name-from-contacts
title: Client Profile Name from Contacts - Design (incl. requirements, tests, deployment, rollback)
document_type: design
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
created: 2026-11-03
last_modified: 2026-11-03
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001, AUTO-SP-FOLDER-001]
---

> Small change. Per `CLAUDE.md` §4 ("for small, low-risk changes, the documents may be concise"), requirements, test plan, deployment and rollback are in this file. README/CHANGELOG/HANDOVER track status.

## 1. Requirements

| ID | Requirement | Source |
|---|---|---|
| FR-001 | When a Client Profile is **created with contacts**, its name becomes its contacts' names (`"A & B"`). | Rod's report + requester |
| FR-002 | When contacts are **added or removed**, the name is recalculated. | Requester (contact removal, CP `2519772272`) |
| FR-003 | A profile **without contacts** keeps its name. No failure, no alert. | Requester: "si se agregara manualmente sin contacto… no quiero que eso haga fallar" |
| FR-004 | Must not block or alter `8800779`. Running twice is acceptable when the result is correct. | Requester |
| FR-005 | All three creation paths are tested: Manual, Internal SuperForm, Leads board. | Requester |
| NFR-001 | Never write an empty name; write only when different (idempotent). | Design |
| NFR-002 | Renaming triggers the existing chain: SharePoint folder rename (PA) and asset cascade (`10083674`). | Design |

**Q1 (open):** a profile created manually with a hand-typed name, which later gets contacts, is renamed to its contacts. This matches the current behaviour of `1054932` when the name has no "&". Confirm that this is wanted.

## 2. Solution

New Make scenario **`M.com: Client Profile Name from Contacts (Nov 2026)`**. It replaces `1054932`, which is deactivated after the tests pass.

```text
Monday CP board ── create_item ───────────────┐
                └─ change_specific_column_value ─┤──> custom webhook (new)
                   (board_relation38)            │
                                                 ▼
  [filter] boardId = 5024661649, numeric pulseId,
           type create_pulse | manual_rerun, or update_column_value on board_relation38
  [3] wait 90 s if create_pulse, else 1 s
  [4] read CP: id, name, state, board, Contacts (ids + display_value)
  [5] Code module name-from-contacts.js → rename | skip(reason)
  [6] if rename: change_simple_column_value(name) ──> Monday change_name ──> PA folder rename + cascade 10083674
  errors on 4/5/6 → failure email (8732008) + Ignore
```

Rule (`name-from-contacts.js`), identical in format to `1054932` / `1054927`:

| Situation | Result |
|---|---|
| No contacts | skip `NO_CONTACTS` (name kept) |
| Contacts present | name = `display_value` with `","` → `" &"`, whitespace normalised |
| Same as current name | skip `UNCHANGED` |
| Archived/deleted, other board, empty or > 255 characters | skip with a reason code |

### How each creation path behaves

| Path | What happens |
|---|---|
| Manual, no contacts | `create_pulse` → wait 90 s → `NO_CONTACTS` → nothing written |
| Manual, contacts linked later | `update_column_value` → rename to the contacts' names |
| Internal SuperForm | `create_pulse` → wait 90 s (the SP folder already exists) → rename "Incoming form answer" → contacts' names → PA renames the folder, and the cascade runs |
| Leads board (`8800779`) | `create_pulse` (0–1 contact) → this run waits 90 s. Meanwhile module 11 sets all contacts → `update_column_value` → rename to "A & B" within seconds. The delayed create run then reads the final state → `UNCHANGED`. If `8800779` copied an interim name to the Lead, `9711585` (Lead linked to CP) and the cascade (CP renamed) align it |
| Contact removed | `update_column_value` → rename to the remaining contacts |

### Why this does not interfere with `8800779`

It only writes the CP `name`, which `8800779` also expects to be renamed (it waits 5 s for exactly that). It never touches Contacts, Leads or other columns. A second run computes the same name and writes nothing.

### Concurrency

Not sequential (Monday's webhook challenge requires it; see the cascade project). Each run reads current data and writes only differences. The 90 s delay on create runs makes them read after the Leads intake has linked all contacts. The remaining race: two contact changes on the same profile within about 1 s. Its worst case is one stale name, corrected by the next change.

### Alternatives rejected

| Alternative | Why not |
|---|---|
| Edit `1054932` | Its trigger is a Make-managed "watch column" (cannot add a create trigger); a custom webhook allows `manual_rerun` and both events in one place |
| Configure the SuperForm to set the item name | The form does not know the contact's name format; it does not cover removals or manual creation |
| Name in the cascade (`10083674`) | That scenario reacts to name changes; mixing in contact changes risks loops |

## 3. Test plan (fictional data; test contacts "Leo Test 15", "leotest 14", test CPs prefixed "ZZ TEST")

| ID | Path / case | Expected | Status |
|---|---|---|---|
| U-01 | Unit tests (14) | Pass | **Passed** 2026-11-03 |
| V-01 | Make schema + FunctionSleep config validation | Valid | **Passed** 2026-11-03 |
| T-01 | Webhook challenge for both Monday webhooks | Accepted | **Passed** 2026-11-03 (`41501839`, `41501840` created) |
| T-02 | **Manual, no contacts**: create "ZZ TEST manual" | Not renamed; run ends at `NO_CONTACTS`; no email | **Passed** 2026-11-03: CP `2898278800`, run 11:46:19 (4 ops, 94 s); name and SP folder unchanged |
| T-03 | Manual: link 1 test contact to T-02 | Renamed to the contact name; SP folder renamed | **Passed** (11:48:19, 5 ops). Name and folder renamed; cascade ran (nothing to rename); `1054932` also ran and wrote the same name (transition) |
| T-04 | Add 2nd contact | "A & B"; cascade runs | **Passed** (11:49:57). Order = Monday's stored link order (the API stored the IDs in a different order than sent); `1054932` produced the same name |
| T-05 | Remove a contact (CP `2519772272` case) | Back to "A" | **Passed** (11:51:25, 5 ops). Name and folder renamed; `1054932` ran with 2 ops and did **not** rename (gap confirmed and covered) |
| T-06 | **SuperForm**: submit the real "SF: Profile Opening" form with a test contact (done by RSFA) | ~90 s later: renamed from "Incoming form answer"; **SP folder renamed** | Planned |
| T-07 | **Leads board**: one fictional Lead through the real intake (done by RSFA, fictional email) | CP "A" or "A & B" as per contacts; Lead name = CP name; no `8800779` error; SP folder correct | Planned |
| T-08 | Replay of a run | `UNCHANGED`, nothing written | **Passed** (replay `d4b698d9…`, 4 ops) |
| T-09 | Existing SuperForm profile `2897989144` via `manual_rerun` | Renamed; SP folder renamed | Planned (after approval) |
| T-10 | Regression: `1054927` (Contact rename) still renames the CP; no loop | One rename per change | Planned |

Clean-up after tests (separate approval): archive the test CPs and Leads; their SharePoint folders stay unless RSFA deletes them.

## 4. Deployment (each write approved)

1. Create the Make hook; import the scenario **inactive** into folder `296569`; re-read and compare it with Git.
2. Activate, then create the Monday webhooks on `5024661649`: `create_item` and `change_specific_column_value` `{"columnId":"board_relation38"}`.
3. Run T-02…T-05 and T-08 (Claude), T-06 and T-07 (RSFA submits the form and a test Lead), T-10.
4. Deactivate `1054932` once the tests pass (keep it; do not delete). Until then both run; they agree except for removals.
5. T-09: fix the existing profile.

## 5. Rollback

Deactivate the new scenario and delete its two Monday webhooks (IDs recorded at creation). Re-activate `1054932` if it was already deactivated. Names already written stay; previous names are in the activity log of each item.

## 6. Risks

| Risk | Mitigation |
|---|---|
| PA folder rename fires before the folder exists | 90 s delay on create; verified by T-06 and T-07 |
| Hand-typed names overwritten when contacts are linked | Q1 |
| `8800779` copies an interim name to the Lead | Self-heals via `9711585` / cascade; verified by T-07 |
