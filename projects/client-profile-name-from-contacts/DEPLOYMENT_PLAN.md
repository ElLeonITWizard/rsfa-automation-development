---
project_id: CP-NAME-FROM-CONTACTS
project_slug: client-profile-name-from-contacts
owner: RSFA
technical_owner: tech@rsfa.co.nz
created: 2026-11-03
last_modified: 2026-11-03
---

# Deployment plan

See [DESIGN.md §4](./DESIGN.md#4-deployment-each-write-approved). Status: approved by the requester on 2026-11-03 (also Q1 = yes: hand-typed names are replaced once contacts are linked). Steps 1–2 done; step 3 partly done (Claude's tests); waiting on the SuperForm and Leads tests (RSFA).

## Deployment record

| Field | Value |
|---|---|
| Make hook | `4485222` "CP Name from Contacts Webhook" |
| Scenario ID | `10093771`, folder `296569`, imported inactive then activated 2026-11-03 11:45Z; re-read: 13 modules, code identical to Git, sequential off |
| Monday webhooks | `41501839` (`create_item`), `41501840` (`change_specific_column_value` `board_relation38`) on `5024661649` |
| 1054932 deactivated | Not yet (after T-06/T-07) |
