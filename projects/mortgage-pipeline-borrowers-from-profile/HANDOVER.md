---
project_id: MP-BORROWERS-FROM-PROFILE
project_slug: mortgage-pipeline-borrowers-from-profile
owner: RSFA
technical_owner: tech@rsfa.co.nz
created: 2026-11-11
last_modified: 2026-11-11
---

# Handover

- Scenario `10141397` (active), hook `4504974`, Monday webhook `41872482`.
- Rule: Mortgage Pipeline items created from the Leads board get Borrowers = the Client Profile Contacts, and their name.
- Maintenance: no double curly braces in `borrowers-from-profile.js`; keep sequential off. Regenerate with `python3 make/build_blueprint.py` and `node tests/borrowers-from-profile.test.js`.
- Follow-ups: DESIGN.md "Known follow-ups".
