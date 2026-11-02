---
project_id: CP-RENAME-CASCADE
project_slug: client-profile-related-assets-renaming
title: Client Profile Renaming - Related Assets Renaming - Requirements
document_type: requirements
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: RSFA technical consultant (for Rod Schubert)
created: 2026-10-31
last_modified: 2026-11-02
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001]
related_systems: [Monday.com, Make.com]
---

## Original business request

See [evidence/original-request.md](./evidence/original-request.md).

## Problem statement

Item names are how advisers recognise records across boards. When a Client Profile is renamed, nothing renames its related items, except the SharePoint folder (Power Automate). The only cascade that exists starts from a Contact rename (`1054927`), and it is incomplete and uses the wrong rule for mortgages. Leads keep the name they had at creation.

## Desired outcome

Whenever a Client Profile's name changes, every related item on the boards listed below is renamed according to its board's rule, in one automatic run. Leads also follow their Client Profile when the Lead's `Client Profiles` column changes.

## Stakeholders

| Role | Name |
|---|---|
| Stakeholder / requester | Rod Schubert (via the RSFA technical consultant) |
| Business owner | Rod Schubert |
| Process owner | TODO: verify |
| Technical owner | tech@rsfa.co.nz |

## Scope

### In scope

- New Make scenario reacting to a Client Profile name change, renaming related items on 10 boards (BR-001…BR-012 except BR-004 and BR-006, which are out of scope since 2026-11-02).
- Completing the inactive Make scenario `9711585` so a Lead is renamed when its `Client Profiles` column changes.
- The prerequisite change to `1054927`: remove every branch that overlaps with the cascade (Existing Mortgage, Existing KiwiSaver, Insurance Pipeline, Existing Insurance). Requester, 2026-11-02: the two scenarios must not overlap.

### Out of scope

- SharePoint folder renaming (already Power Automate; unchanged).
- A historical back-fill of existing drift (supported by the design via `manual_rerun`; a bulk run needs separate approval).
- 💲Mortgage Pipeline (`5025201889`) and 📈 KiwiSaver Pipeline (`5025201954`): boards still in progress (items without Borrowers / Client Profiles, unusual names). Excluded by the requester on 2026-11-02; revisit when the boards are finalised.
- Network contacts (`5031819688`) on the Aircall board: they do not belong to a Client Profile.
- Changing the Client Profile naming rule itself (`1054927`/`1054932`).

## Functional requirements

| ID | Requirement | Evidence | Status |
|---|---|---|---|
| FR-001 | When a Client Profile item's name changes (manual or automated), the cascade runs for that profile. | Confirmed requirement | Draft |
| FR-002 | Each related item is recalculated with its own board rule (BR-001…BR-012) and renamed only when the result differs from its current name. | Confirmed requirement (2026-10-31) | Confirmed |
| FR-003 | Related items are found from the item's own link column (reverse lookup), not only from the profile's reflection columns. | Inference (Leads → CP has no reflection; Confirmed from live system) | Draft |
| FR-004 | A Lead is renamed to its Client Profile's name when its `Client Profiles` column (`board_relation_mm7c1wcw`) changes and links exactly one active profile. | Confirmed requirement | Draft |
| FR-005 | The cascade can be re-run on demand for one profile (`manual_rerun` event) for recovery or back-fill. | Inference (recovery need) | Draft |
| FR-006 | Every failure sends the standard failure email (`8732008`) to tech@rsfa.co.nz. Other items still continue after one item fails. | Inference (RSFA standard) | Draft |

## Non-functional requirements

| ID | Requirement | Category | Status |
|---|---|---|---|
| NFR-001 | Never write an empty name; never rename an item linked to several or other profiles. | Reliability | Draft |
| NFR-002 | Idempotent: a second run over the same state renames nothing. | Reliability | Draft |
| NFR-003 | Safety cap: more than 150 planned renames for one profile → nothing is renamed and an alert is sent. | Reliability | Draft |
| NFR-004 | Runs are processed sequentially (no two cascades in parallel). | Reliability | Draft |
| NFR-005 | Alerts and logs carry IDs and reason codes, not client names. | Security | Draft |
| NFR-006 | No new rename loop: the cascade does not rename Contacts or Client Profiles. | Reliability | Draft |

## Business rules

| ID | Rule | Source |
|---|---|---|
| BR-001 | Leads `2074688480`: Client Profile name | Request + `8800779` |
| BR-002 | Mortgage App `5025483251`: Client Profile name | Request + `8410524` |
| BR-003 | SOP Masterboard `5026186805`: Client Profile name | Request + `10037840` |
| BR-004 | ~~KiwiSaver Pipeline `5025201954`: Client Profile name~~ **Out of scope (2026-11-02)** | Requester |
| BR-005 | Existing KiwiSaver `5024672484`: Client Profile name | `1054927` (live) — TODO: verify with Rod |
| BR-006 | ~~Mortgage Pipeline `5025201889`: Borrowers~~ **Out of scope (2026-11-02)** | Requester |
| BR-007 | Existing Mortgages `5024672364`: Borrowers, `"A, B"` → `"A & B"` | Request + requester 2026-10-31 + `1228763` |
| BR-008 | Insurance Pipeline `5025201920`: Policy Owners joined `" & "` + `" \| Provider"` when set | `1215342` (live) |
| BR-009 | Existing Insurance `5024672437`: Policy Owners joined `" & "` + `" \| Insurance Provider"` when set | Request + `1215342` |
| BR-010 | Insurance Questionnaire `5025365501`: Insured Party contact name | Request + `9447215` |
| BR-011 | KiwiSaver Questionnaire `5026459551`: Contact name | Request + `9447215` |
| BR-012 | Aircall `5026308494`: linked contact name (skip while `Contact Created/Updated` = `Revert`) | Request + `9869454` |

## Exceptions

- Item linked to more than one Client Profile (cp rule) or more than one contact (contact rule): skipped, with a reason code.
- Item with no Borrowers / Policy Owners: skipped (keeps its name).
- Archived or deleted Client Profile: no action.

## Duplicate prevention

Each item is planned once even when it is found through two link columns (KiwiSaver Pipeline, insurance boards).

## Idempotency

An item is written only when its computed name differs from its current name.

## Error handling requirements

See FR-006, NFR-003.

## Logging and alerting requirements

The failure email states the profile ID, board and item IDs, and the abort or skip code. Names stay in Make execution history only.

## Manual recovery requirements

Re-send the event with `event.type = "manual_rerun"` (HANDOVER.md).

## Security and privacy requirements

No client names in Git, alerts or logs. No webhook URLs in Git.

## Data retention requirements

Previous names are recoverable only from Make execution history (retention: TODO: verify).

## Acceptance criteria

| ID | Criterion | Linked requirement(s) | Status |
|---|---|---|---|
| AC-001 | Renaming a test Client Profile renames its test Lead, Mortgage App, SOP Masterboard and Existing KiwiSaver items to the new profile name within 2 minutes. | FR-001, FR-002 | Planned |
| AC-002 | Renaming a test Contact (via `1054927`) renames the test IQ, KQ and Aircall items, and the mortgage items follow Borrowers, not the profile name. | FR-002, BR-006, BR-007 | Planned |
| AC-003 | Linking a test Lead to a test Client Profile renames the Lead to the profile name. | FR-004 | Planned |
| AC-004 | A second identical event renames nothing. | NFR-002 | Planned |
| AC-005 | An item linked to two profiles keeps its name. | NFR-001 | Planned |

## Assumptions

- Monday sends the `change_name` webhook for renames made through the API (for example by `1054927`), not only for manual ones. Inference: the SharePoint folder rename already relies on this. To be verified by TEST_PLAN T-04.
- No Monday native automation renames items on the 12 boards (TODO: verify).

## Open questions

- **Q1.** Manual suffixes on names (seen live on a Mortgage Pipeline item) are removed when the rule is reapplied. Is that acceptable, or must some names be protected (for example, a "Lock name" checkbox)?
- **Q2.** Confirm with Rod BR-005 (Existing KiwiSaver named from the Client Profile) and BR-008 (Insurance Pipeline uses the same rule as Existing Insurance).
- **Q3.** Back-fill: run the cascade once for every Client Profile to fix existing drift? (Bulk change; needs approval and an operations estimate.) **Leads:** requested by the requester on 2026-11-02; dry run in `evidence/logs/2026-11-02-leads-backfill-dry-run.md`.

## Approval status

Requirements: Draft — naming rules confirmed by the requester on 2026-10-31; Rod's confirmation of Q1–Q3 pending.
