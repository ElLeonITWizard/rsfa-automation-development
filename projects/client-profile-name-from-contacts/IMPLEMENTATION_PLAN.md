---
project_id: CP-NAME-FROM-CONTACTS
project_slug: client-profile-name-from-contacts
owner: RSFA
technical_owner: tech@rsfa.co.nz
created: 2026-11-03
last_modified: 2026-11-03
---

# Implementation plan

| Step | Action | Status |
|---|---|---|
| 1 | Live current-state research (read-only) | Complete 2026-11-03 |
| 2 | `make/code/name-from-contacts.js` + 14 unit tests | Complete |
| 3 | `make/build_blueprint.py` → `make/blueprints/cp-name-from-contacts.candidate-v1.json`; Make validation | Complete |
| 4 | Deployment steps 1–5 ([DESIGN.md §4](./DESIGN.md#4-deployment-each-write-approved)) | Awaiting approval |

Regenerate after any change:

```bash
python3 make/build_blueprint.py
node tests/name-from-contacts.test.js
```

Connection `240128`; failure email `SCN_8732008`; folder `296569`.
