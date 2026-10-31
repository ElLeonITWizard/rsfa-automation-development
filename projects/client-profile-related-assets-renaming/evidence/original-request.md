---
project_id: CP-RENAME-CASCADE
project_slug: client-profile-related-assets-renaming
title: Client Profile Renaming - Related Assets Renaming - Original Request
document_type: original-request
status: Draft
owner: RSFA
technical_owner: tech@rsfa.co.nz
requester: RSFA technical consultant (tech@rsfa.co.nz), on behalf of Rod Schubert
created: 2026-10-31
last_modified: 2026-10-31
related_automations: [AUTO-NAMING-001, AUTO-LEADS-001, AUTO-SP-FOLDER-001]
related_systems: [Monday.com, Make.com, Power Automate, SharePoint]
---

> This file preserves source evidence. It is not the confirmed technical specification.
>
> Structured requirements derived from this request belong in [REQUIREMENTS.md](../REQUIREMENTS.md).

## Request metadata

| Field | Value |
|---|---|
| Requester | RSFA technical consultant (tech@rsfa.co.nz). The request summarises "several threads and conversations with Rod". |
| Request date | 2026-10-31 |
| Source platform | Claude Code session (developer request) |
| Channel or conversation | Claude Code session `session_015Hewcvw2Q6UoG5W1S3yYVR` |
| Thread or message link | Not applicable. The underlying Slack threads with Rod were not supplied — TODO: verify and link them. |
| Known deadline | TODO: verify |
| Immediate operational impact | Consistency/clarity of item names across boards. No data loss or blocked processing reported. |

## Original message

Verbatim (Spanish):

> En base a varios threads y conversaciones que estuvimos teniendo con Rod, iniciamos una tarea llamada Client Profile Renaming - Related Assets Renaming.
>
> Que significa esta tarea? Para mantener consistente la informacion a traves de todos los boards, especialmente en este caso los nombres de los items descriptivos y comprensibles rapidamente, decidimos seguir cierta nomenclatura a traves de distintos boards.
>
> Por ej. Como notaras en muchas automatizaciones actuales de Make, cuando se crea un asset suele tomar el nombre del Client Profile o del Contact que lo compone.
>
> Por ej.
>
> * Los items del board Mortgage App toman el nombre del Client Profile asociado.
> * Los items del Insurance Questionnaire los del Insured Party (Porque siempre son 1 contact el que los completa)
> * Los de KiwiSaver Questionnaire del Contact asociado
> * Existing Mortgages de los Borrowers asociados
> * Existing Insurance del Policy Owners | Insurance Provider
> * Aircall/VOIP Board del Network/Client Contact asociado
> * SOP Masterboard del Client Profile asociado
> * Las Pipelines estan en progreso, no creo que este implementado esto ahi tambien. Aunque apuntamos a eso. No estoy seguro la verdad.
> * Esto es algo que deberia estar implementado pero no lo esta, los Leads deberian ser renombrados por el nombre del Client Profile que se crea una vez que se dispara el flujo M.com: Creating Contact and Client Profile after Lead was Added (Mar 2026). Quizas es mas reliable hacer un flujo que renombre el lead cuando la columna Client Profiles cambia, por las dudas que la cambien de otra manera.
>
> Este es un panorama general de como funciona el renombramiento a traves de nuestros boards de momento.
>
> Ahora, lo que queremos implementar va un nivel mas alla, y tiene que ver con mantener la consistencia.
>
> Queremos que si un Client Profile es renombrado, todos sus assets relacionados (Si estuvieran presentes en alguno de todos los boards que mencione) se renombren. Creo que inevitablemente para esto vamos a necesitar una automatizacion que se dispare cuando haya un renombramiento de Client Profile y busque a traves de todos los boards sus assets relacionados y cambie los nombres. Esta la quiero hacer en Make. Ya existe una en Power Automate que renombra la carpeta de SharePoint del cliente cuando se renombra el Client Profile. De nuevo... Consistencia.
>
> Me ayudas a llevar esta automatizacion a cabo + el ajuste que necesitamos para el renombramiento de los items en el Leads board?

## Later clarifications

| Date | From | Clarification |
|---|---|---|
| 2026-10-31 | Requester (answers to Claude's questions) | When a Client Profile is renamed, **every related asset is recalculated with its own naming rule** (Client Profile, Contact, Borrowers, Policy Owners \| Provider) and updated only if it differs — not only the Client-Profile-named boards. |
| 2026-10-31 | Requester | **Mortgage Pipeline and Existing Mortgages are named from Borrowers** (not from the Client Profile name). |
| 2026-10-31 | Requester | Scope of this session: **design + candidate blueprints only; nothing created or changed in Make, Monday or SharePoint** until the exact actions are approved. |

## Attachments

None.

## Screenshots

None.

## Supplied payloads

None.

## Known approvals

- Design and local build: requested by the requester (2026-10-31).
- No approval yet for any production write (Make, Monday webhooks, `1054927` change). Rod's business confirmation of the naming rules: TODO: verify.

## Missing information

- The original Slack threads with Rod (dates, links, exact wording).
- Whether Rod has approved the per-board naming rules recorded in REQUIREMENTS.md BR-001…BR-012.
- Whether manual suffixes on item names (one live example seen: a Mortgage Pipeline item with an extra tag after the borrower names) must survive automatic renaming.

## Notes on interpretation

- "SOP Masterboard" is board `5026186805`, whose live name is now `SOP Masterboard` (the canonical registry still calls it `Masterboard: End Forms`).
- "Aircall/VOIP Board" is `📞 Aircall: VOIP Call Board` (`5026308494`); its `Network/Client Contact` column can link either Contacts (`2074688484`) or the network board `5031819688`. Only Contacts belong to a Client Profile.
