---
project_id: CP-NAME-FROM-CONTACTS
project_slug: client-profile-name-from-contacts
owner: RSFA
technical_owner: tech@rsfa.co.nz
created: 2026-11-03
last_modified: 2026-11-03
---

# Rollback plan

See [DESIGN.md §5](./DESIGN.md#5-rollback). Never delete Monday webhooks other than the two created by this project (record their IDs in DEPLOYMENT_PLAN.md).

Created on 2026-11-03: scenario `10093771`, hook `4485222`, Monday webhooks `41501839` and `41501840` (`mutation { delete_webhook(id: 41501839) { id } }`).
