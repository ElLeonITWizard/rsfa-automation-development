---
project_id: CP-NAME-FROM-CONTACTS
project_slug: client-profile-name-from-contacts
owner: RSFA
technical_owner: tech@rsfa.co.nz
created: 2026-11-03
last_modified: 2026-11-03
---

# Handover (draft)

- Rule: Client Profile name = its Contacts (`"A & B"`), recalculated on creation (after 60 s) and on every contact add or remove. Profiles without contacts keep their name.
- Replaces `1054932` (deactivated 2026-11-03; re-activate only for rollback).
- Maintenance: no double curly braces in `name-from-contacts.js`; keep sequential processing off.
- Recovery: POST `{"event":{"type":"manual_rerun","boardId":5024661649,"pulseId":<id>}}` to the scenario hook (URL in Make only).
- Canonical docs (`AUTO-NAMING-001`, `AUTO-LEADS-001`) to be updated after validation.
