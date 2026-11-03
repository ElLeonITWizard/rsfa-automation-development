---
project_id: CP-NAME-FROM-CONTACTS
project_slug: client-profile-name-from-contacts
owner: RSFA
technical_owner: tech@rsfa.co.nz
created: 2026-11-03
last_modified: 2026-11-03
---

# Changelog

| Date | Phase | Change | Status |
|---|---|---|---|
| 2026-11-03 | Investigation | Rod report analysed: SuperForm-created profile kept "Incoming form answer"; contact removal not renamed. Root cause: `1054932` listens to changes only, and its filter blocks removals. Not a cascade defect | Complete |
| 2026-11-03 | Design/Build | Rule + 14 unit tests; candidate blueprint validated in Make; 90 s create delay for SP folder creation | Complete (local) |
| 2026-11-03 | Deployment | Approved. Hook `4485222`; scenario `10093771` imported inactive, verified, activated; Monday webhooks `41501839` and `41501840` | Done |
| 2026-11-03 | Testing | T-01…T-05 and T-08 Passed on test CP `2898278800` (manual path, add/remove contacts, SP folder follows, idempotent). Pending: T-06 SuperForm, T-07 Leads (RSFA), T-09, T-10, deactivate `1054932` | In progress |
| 2026-11-03 | Deployment | Create delay 90 → 60 s (requester; 27 measured creations, max 50.8 s). SuperForm path simulated via the API: Passed. `1054932` **deactivated**. Profile `2897989144` fixed (name + SP folder). Test CPs `2898278800` and `2898257165` archived (their SP folders remain) | Production; T-07 (real Lead) and the real-form check pending |
