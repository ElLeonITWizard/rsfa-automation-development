---
project_id: CP-NAME-FROM-CONTACTS
project_slug: client-profile-name-from-contacts
title: Client Profile Name from Contacts - Original Request
document_type: original-request
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: RSFA technical consultant (tech@rsfa.co.nz), following a report from Rod Schubert
created: 2026-11-03
last_modified: 2026-11-03
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001, AUTO-SP-FOLDER-001]
related_systems: [Monday.com, Make.com, Power Automate]
---

> This file preserves source evidence. It is not the confirmed technical specification. Client names are replaced by item IDs (public repository).

## Request metadata

| Field | Value |
|---|---|
| Requester | RSFA technical consultant, after Rod Schubert's Slack report |
| Request date | 2026-11-03 |
| Source platform | Slack (Rod's report) + Claude Code session (requester) |
| Channel or conversation | Slack thread from Rod (link not supplied — TODO: verify); session `session_015Hewcvw2Q6UoG5W1S3yYVR` |
| Known deadline | TODO: verify |
| Immediate operational impact | New Client Profiles created by the internal SuperForm keep the placeholder name "Incoming form answer" (and their SharePoint folder too) |

## Original message

Rod (Slack, paraphrased; names replaced): "Profile addition via SF — confused? Profile created; waited several minutes; the (single) contact is not renaming the Profile Name, or the SP link. This would have been tested by you; therefore highly confused. Please advise?" Client Profile `2897989144`.

Same thread, separate topic (out of scope here): DocuSeal should allow sending to only one contact of a two-contact profile (separated couple; Client Profile `2519772272`).

Requester (verbatim, Spanish): "el tema del punto 2 es que hay que tener en cuenta que pasa si se agregara manualmente sin contacto... No quiero que eso haga fallar la automatizacion. Ademas no quiero que intervenga ni bloquee otras automatizaciones, por ej. la de M.com: Creating Contact and Client Profile after Lead was Added (Mar 2026) que ya crea el Client Profile con el nombre correcto. A ver... No es la gran cosa que se dispare dos veces, siempre y cuando lo haga bien. Probemoslo bien. Hay 3 maneras de que un profile llegue a crearse. Manual, Client Profiles Internal SuperForm y desde el Leads Board. Hay que tener muy en cuenta las 3"

## Later clarifications

None yet.

## Known approvals

None for production writes yet.

## Missing information

- Whether a manually typed Client Profile name must survive when contacts are linked later (see REQUIREMENTS Q1).

## Notes on interpretation

Investigation (2026-11-03, read-only) showed two pre-existing gaps, not defects of the rename cascade: see CURRENT_STATE_REFERENCES.md.
