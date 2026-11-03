# Client Profile Name from Contacts

| Field | Value |
|---|---|
| Project slug | `client-profile-name-from-contacts` |
| Project status | Testing — `10093771` active since 2026-11-03 (runs in parallel with `1054932` until the SuperForm and Leads tests pass) |
| Requester | RSFA technical consultant, after Rod Schubert report |
| Technical owner | tech@rsfa.co.nz |
| Related project | [client-profile-related-assets-renaming](../client-profile-related-assets-renaming/) |

Goal: a Client Profile always carries its Contacts names, whichever way it was created (Manual, Internal SuperForm, Leads board), and when contacts are added or removed. Profiles without contacts are left alone.

Documents: [DESIGN.md](./DESIGN.md) (requirements, design, tests, deployment, rollback), [CURRENT_STATE_REFERENCES.md](./CURRENT_STATE_REFERENCES.md), [evidence/original-request.md](./evidence/original-request.md), and the short pointer files.
