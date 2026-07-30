# RSFA Automation Development

@../rsfa-technical-knowledge/CLAUDE.md

## 1. Repository purpose

This repository is the working environment for designing, building, testing, deploying and handing over RSFA automation changes.

It contains development work such as:

- New Make.com scenarios.
- Changes to existing Make.com scenarios.
- Power Automate development.
- Monday.com workflow and automation designs.
- Google Cloud functions used by automations.
- Integration payloads and mappings.
- Technical requirements.
- Architecture and implementation plans.
- Test plans and test evidence.
- Deployment and rollback plans.
- Project-specific decisions.
- Development changelogs.
- Handover material.

This repository is not the canonical description of current RSFA production behaviour.

The adjacent repository is the canonical technical knowledge source:

```text
../rsfa-technical-knowledge/
```

Development files describe proposed, in-progress or recently deployed work unless they are explicitly marked as validated and reflected in the canonical knowledge repository.

---

## 2. Relationship with the technical knowledge repository

Before designing, modifying or troubleshooting an RSFA automation, consult the relevant canonical files in:

```text
../rsfa-technical-knowledge/knowledge/
```

At minimum, review:

```text
../rsfa-technical-knowledge/knowledge/00_PROJECT_GUIDE.md
../rsfa-technical-knowledge/knowledge/01_RSFA_SYSTEM_MAP.md
../rsfa-technical-knowledge/knowledge/02_SYSTEMS_REGISTRY.md
../rsfa-technical-knowledge/knowledge/03_AUTOMATION_REGISTRY.md
../rsfa-technical-knowledge/knowledge/04_MONDAY_BOARDS_REGISTRY.md
../rsfa-technical-knowledge/knowledge/05_CONTACTS_AND_ROLES.md
../rsfa-technical-knowledge/knowledge/06_NAMING_AND_ID_CONVENTIONS.md
```

Also read the detailed documents for:

- The affected automation.
- The affected systems.
- The affected Monday boards.
- Related incidents.
- Related architectural decisions.
- Related playbooks.

Do not duplicate canonical registries or system documentation in this repository.

Reference them using relative paths.

---

## 3. Source-of-truth rules

Use evidence in this order:

1. Current production configuration retrieved through approved read-only access.
2. Canonical documentation in `rsfa-technical-knowledge`.
3. Current exports or source documents.
4. Project requirements approved for the current change.
5. Recent Slack discussions and stakeholder clarifications.
6. Historical documentation.
7. Clearly labelled inference.

A requirement document describes intended behaviour.

It does not prove current production behaviour.

When the live system conflicts with canonical documentation:

1. Identify the discrepancy.
2. Do not silently choose one.
3. Determine whether production behaviour is intended.
4. Record the evidence.
5. Update the canonical repository only after verification.

Use these evidence labels:

- `Confirmed from live system`
- `Confirmed from canonical documentation`
- `Confirmed requirement`
- `Historical`
- `Inference`
- `Unknown`
- `TODO: verify`

Never present an inference as a confirmed fact.

---

## 4. Default working mode

Every material RSFA technical request is handled as a development project under `projects/<project-slug>/` (see section 5). Do not begin by creating a Make.com scenario, Power Automate flow, Monday.com configuration or other production asset.

Use this sequence:

```text
Original request
→ Evidence capture
→ Requirements analysis
→ Current-state research
→ Clarify
→ Design
→ Review
→ Build
→ Test
→ Deploy
→ Validate
→ Document
→ Handover
→ Canonical documentation update
```

Do not begin implementation before the requirement and current-state context are sufficiently understood.

For small, low-risk changes, the documents may be concise.

For complex or production-critical changes, use the full project structure and approval gates.

### Default stopping points

Unless the user explicitly asks to continue further:

- **Intake stops before design.** For a new ticket, complete only `evidence/original-request.md`, `REQUIREMENTS.md` and `CURRENT_STATE_REFERENCES.md`, then report back (see section 5) instead of continuing into `DESIGN.md`.
- **Design stops before external writes.** Do not generate a production blueprint, or create or modify anything in Make.com, Power Automate, Monday.com, SharePoint or any other external system, until `DESIGN.md`, `IMPLEMENTATION_PLAN.md`, `TEST_PLAN.md`, `DEPLOYMENT_PLAN.md` and `ROLLBACK_PLAN.md` are complete and the user has approved moving to build.
- **Build stops before deployment.** Candidate assets are prepared and stored locally first; see section 10 (Make.com) for the pre-write approval checklist required before any external write.

These are defaults, not permission overrides — section 8 (Approval rules) and section 9 (External-system safety) still govern what may actually be written to a live system.

---

## 5. Project intake and creation workflow

This section defines how a new RSFA request becomes a project, and what happens before design and implementation begin.

### New-ticket behaviour

When the user provides a Slack request, email, ticket, screenshot, copied message or other technical request and asks to start a new project — including a request phrased simply as:

```text
Create a new project from this RSFA Slack request and follow the intake workflow defined in CLAUDE.md:

[request]
```

the required steps are:

1. Propose a descriptive project slug (see section 6).
2. Create the required project structure (section 6).
3. Copy the relevant templates from `templates/` (section 21) into the new project.
4. Preserve the original request in `evidence/original-request.md`.
5. Consult the canonical technical knowledge repository (section 2).
6. Extract structured requirements into `REQUIREMENTS.md` (section 7, section 8).
7. Identify affected systems, automations, scenarios, flows and boards in `CURRENT_STATE_REFERENCES.md`.
8. Identify assumptions and missing evidence.
9. Stop after intake and current-state research unless the user explicitly asks to continue.
10. Do not create or modify external systems during intake.

The default first phase is **intake and current-state research only** — not immediately building the automation.

### Evidence capture

Preserve the original request in:

```text
evidence/original-request.md
```

This file must contain:

- Requester.
- Request date.
- Source platform.
- Channel or conversation.
- Thread or message link when available.
- Original message (preserve quoted source text verbatim where appropriate).
- Later clarifications.
- Attachments or screenshots.
- Known approvals.
- Information still missing.

Do not rewrite the original request as though it were a confirmed technical specification.

### Design gate report

When intake stops before design (see section 4), provide:

1. Summary of the request.
2. Confirmed current architecture.
3. Affected systems and automations.
4. Missing information.
5. Minimum questions requiring clarification.
6. Recommended next phase.

When the original request is incomplete:

1. Extract everything that is confirmed.
2. Label assumptions.
3. Identify only the minimum clarification questions required.
4. Continue all work that does not depend on those answers.

---

## 6. Project structure

Each material automation change should have its own folder under:

```text
projects/
```

Required structure:

```text
projects/<project-slug>/
├── README.md
├── REQUIREMENTS.md
├── CURRENT_STATE_REFERENCES.md
├── DESIGN.md
├── IMPLEMENTATION_PLAN.md
├── TEST_PLAN.md
├── DEPLOYMENT_PLAN.md
├── ROLLBACK_PLAN.md
├── CHANGELOG.md
├── HANDOVER.md
├── evidence/
│   ├── original-request.md
│   ├── screenshots/
│   ├── exports/
│   ├── payloads/
│   └── logs/
├── make/
│   ├── blueprints/
│   ├── mappings/
│   └── payloads/
├── power-automate/
├── monday/
├── google-cloud/
└── tests/
    ├── fixtures/
    └── results/
```

Always create:

- The ten root Markdown documents.
- The `evidence/` folder and `evidence/original-request.md`.
- The `tests/` folder when testing is expected.

Create only the platform-specific folders (`make/`, `power-automate/`, `monday/`, `google-cloud/`) that are relevant to the implementation.

Use templates from `templates/` (see section 21) rather than creating blank documents.

### Project slug

Use lowercase kebab-case.

Examples:

```text
email-filing-execution-log
aircall-slack-notification
insurance-renewal-template-fix
mortgage-app-masterboard-mapping
```

Do not use ambiguous names such as:

```text
new-flow
test
final
project-1
automation-update
```

Follow the canonical naming guidance in:

```text
../rsfa-technical-knowledge/knowledge/06_NAMING_AND_ID_CONVENTIONS.md
```

---

## 7. Required project documents

### `REQUIREMENTS.md`

Define:

- The problem.
- Stakeholder request.
- Business objective.
- In scope / out of scope.
- Functional requirements, numbered `FR-001`, `FR-002`, ...
- Non-functional requirements, numbered `NFR-001`, `NFR-002`, ...
- Rules and exceptions.
- Duplicate prevention.
- Error handling.
- Manual recovery.
- Acceptance criteria.
- Assumptions (explicitly labelled).
- Open questions.
- Approval status.

Do not implement ambiguous requirements without clarification when ambiguity creates material risk.

Do not describe a proposed technical implementation as a confirmed client requirement.

### `CURRENT_STATE_REFERENCES.md`

Reference canonical knowledge without copying it.

Include:

- Canonical automation IDs.
- Relevant systems.
- Exact Make scenario names and IDs.
- Exact Power Automate flow names.
- Relevant Monday boards and IDs, and column titles/IDs when known.
- Relevant source documents.
- Current production evidence.
- Known incidents, decisions and playbooks.
- Known limitations and documentation gaps.
- Discrepancies and live verification still required.

### `DESIGN.md`

Define:

- Proposed architecture.
- Systems involved.
- Trigger.
- Inputs and outputs.
- Routing logic.
- Data mapping.
- Dependencies.
- Duplicate prevention and idempotency.
- Error handling.
- Logging and alerts.
- Manual recovery.
- Security.
- Alternatives considered.
- Risks.

### `IMPLEMENTATION_PLAN.md`

Define:

- Ordered implementation steps.
- Files and platform assets affected.
- Required access.
- Preconditions.
- Dependencies.
- Review points.
- Implementation status.

### `TEST_PLAN.md`

Define test cases per section 16, plus:

- Expected results.
- Duplicate-prevention checks.
- Failure-path tests.
- Downstream validation.
- Test-data restrictions (see section 15).
- Regression coverage.

### `DEPLOYMENT_PLAN.md`

Define deployment steps per section 10 (Make.com) / section 11 (Power Automate), plus:

- Required approvals.
- Scheduling considerations.
- Production assets affected.
- Pre-deployment backup.
- Monitoring window.
- Post-deployment checks.

### `ROLLBACK_PLAN.md`

Define:

- Rollback trigger.
- Previous known-good state.
- Backup or export location.
- Reversal steps.
- Data reconciliation.
- Validation after rollback.

### `CHANGELOG.md`

Record:

- What changed.
- Why.
- Date.
- Status (see section 18).
- Deployment result.
- Validation result.
- Remaining work.

### `HANDOVER.md`

Summarise:

- Final behaviour.
- Maintenance procedure.
- Known limitations.
- Monitoring.
- Manual recovery.
- Canonical documentation updated.
- Outstanding tasks.

---

## 8. Requirements handling

When a request comes from Slack, email or a stakeholder conversation:

1. Capture the original request accurately in `evidence/original-request.md` (section 5).
2. Retrieve the full thread or conversation when available.
3. Separate the requested outcome from the proposed implementation.
4. Identify later clarifications.
5. Record assumptions.
6. Identify acceptance criteria.
7. Identify who can clarify or approve the requirement.
8. Link the source in `REQUIREMENTS.md`.

Do not treat a short Slack message as complete requirements when relevant context exists elsewhere.

---

## 9. Approval rules

Routine technical maintenance and explicitly requested fixes may not require separate approval from Rod.

Obtain explicit approval before:

- New paid subscriptions.
- Billing changes.
- Major permission changes.
- Microsoft tenant administration changes.
- Aircall administrative changes.
- Broad cross-business process changes.
- Destructive or irreversible actions.
- Bulk production modifications.
- Material changes requested only by Seth or Jet.
- Deployment where the business outcome remains unclear.

Kathleen may define and validate insurance process requirements but does not provide broad production or infrastructure approval.

Refer to:

```text
../rsfa-technical-knowledge/knowledge/05_CONTACTS_AND_ROLES.md
```

---

## 10. External-system safety

Prefer read-only investigation before write actions.

Do not modify an external system unless:

- The user explicitly requested the change.
- The exact target is known.
- The expected outcome is known.
- Dependencies have been reviewed.
- A test approach exists.
- Rollback has been considered.
- The action is within authorised scope.

Never perform without explicit approval:

- Bulk deletion.
- Destructive changes.
- Irreversible changes.
- Credential replacement.
- Permission removal.
- Production scenario replacement.
- Disabling critical automations.
- Moving or renaming large numbers of files.
- Unrelated "helpful" modifications.

Do not run a production automation merely to inspect it.

Use existing run history, exports or read-only metadata where possible.

---

## 11. Make.com development rules

### Before modifying Make.com

Read:

- The canonical automation document.
- The Make inventory and call graph.
- Relevant source material.
- Related Monday board schemas.
- Related subscenario documentation.
- Current blueprint when available.

### Naming

Follow:

```text
../rsfa-technical-knowledge/knowledge/06_NAMING_AND_ID_CONVENTIONS.md
```

Preferred new scenario pattern:

```text
M.com: [Clear functional description] (MMM YYYY)
```

Use `Subflow` in reusable subscenario names.

### Scenario design

For each scenario, identify:

- Exact trigger.
- Scheduling.
- Parent, bridge, standalone or subscenario role.
- Input contract.
- Output contract.
- Apps and connections.
- Filters.
- Routers.
- Iterators and aggregators.
- Data mappings.
- Error handlers.
- Retry behaviour.
- Duplicate prevention.
- Logging.
- Manual reprocessing.
- Called subscenarios.
- Calling scenarios.

### New scenarios

Before creating a new scenario, determine whether the requirement should be:

- Added to an existing scenario.
- Implemented as a reusable subscenario.
- Implemented as an independent business automation.
- Implemented using Monday native automation.
- Implemented using Power Automate.
- Implemented using Google Cloud custom code.

Do not create unnecessary scenarios.

### Blueprints

Store exported or generated blueprints under:

```text
projects/<project>/make/blueprints/
```

Use clear names such as:

```text
before-change.json
candidate-v1.json
candidate-v2.json
deployed-2026-07-30.json
rollback.json
```

Never store connection secrets or secret webhook URLs.

### Pre-write approval

Candidate blueprints are generated and validated locally first. Before any write to Make.com, provide:

- Target organisation.
- Target team.
- Target folder.
- Scenario name.
- Scenario state.
- Scheduling state.
- Module sequence.
- Connections used.
- Exact resource to be created or updated.
- Rollback method.
- Remaining risk.

### Deployment

Before deployment:

1. Export the current production blueprint.
2. Record current scheduling and activation state.
3. Record scenario ID.
4. Confirm connections.
5. Review changed modules and mappings.
6. Run planned tests.
7. Define rollback.
8. Deploy during an appropriate window.
9. Validate production behaviour.
10. Record the final blueprint.

Do not describe a scenario as deployed successfully until production validation is complete.

---

## 12. Power Automate development rules

Before modifying a flow:

- Read the canonical automation document.
- Identify parent and child flows.
- Review connections.
- Review trigger conditions.
- Review environment variables.
- Review SharePoint, Outlook and Monday dependencies.
- Review available run-history limitations.
- Export the current solution or flow definition where possible.

Use descriptive names.

Distinguish:

- Automated flows.
- Instant flows.
- Scheduled flows.
- Child flows.
- Manual maintenance flows.
- Bulk maintenance flows.

Before deployment:

- Preserve the current version.
- Check connection references.
- Test with sanitised data.
- Validate failure branches.
- Validate duplicate prevention.
- Validate downstream SharePoint and Monday results.
- Validate Slack notifications where relevant.

---

## 13. Monday.com development rules

Before changing a board, column, workflow or automation:

- Record exact board ID.
- Record exact column title and ID.
- Review Make.com mappings.
- Review Power Automate mappings.
- Review Superforms and Monday Forms.
- Review mirrors and board relations.
- Review native workflows and automations.
- Review dashboard or view impact.
- Review permissions.

Do not assume a column rename is cosmetic.

For new columns:

- Use a descriptive title.
- Record the generated column ID.
- Document purpose.
- Define who updates it.
- Define whether it is user-facing or bot-managed.
- Define status labels.
- Define automation dependencies.

For new workflows:

- Prefer an outcome-oriented name.
- Document the trigger.
- Document every board created or changed.
- Document duplicate-prevention behaviour.
- Document external automation triggers.

---

## 14. Google Cloud development rules

Use Google Cloud only when custom code provides clear value over Make.com, Power Automate or Monday native capabilities.

Known projects include:

```text
RSFA Functions
Project ID: strange-calling-402307

Real Savvy Ref backend
Project ID: rsfa-backend-fix
```

For custom functions, document:

- Project.
- Function name.
- Runtime.
- Region.
- Trigger.
- Authentication.
- Request schema.
- Response schema.
- Calling automations.
- Logging.
- Error handling.
- Deployment procedure.
- Rollback procedure.

Do not store credentials or service-account keys in Git.

---

## 15. Shared assets

Use:

```text
shared/
```

for reusable development assets that are not specific to one project.

Examples:

```text
shared/make/
shared/power-automate/
shared/monday/
shared/google-cloud/
shared/schemas/
shared/test-data/
```

Do not place production source-of-truth documentation in `shared/`.

Do not place client data in shared fixtures.

---

## 16. Test-data rules

Never use unnecessary real client data.

Use:

- Fictional names.
- Sanitised email addresses.
- Synthetic Monday items.
- Non-production folders where possible.
- Redacted payloads.
- Controlled test records.

Do not commit:

- Mortgage application data.
- Insurance information.
- Bank statements.
- Identification documents.
- Medical information.
- Full emails.
- Call recordings.
- Unredacted transcripts.
- Access tokens.
- Secret webhook URLs.

---

## 17. Testing expectations

Testing should cover, where applicable:

- Standard successful processing.
- Missing optional fields.
- Missing required fields.
- Empty values.
- Duplicate events.
- Reprocessing.
- Invalid relations.
- Missing SharePoint folders.
- Missing templates.
- Invalid API responses.
- External service unavailability.
- Rate limits.
- Partial completion.
- Error-handler execution.
- Downstream automation impact.
- Idempotency.
- Manual recovery.

Use these test statuses:

- `Planned`
- `Passed`
- `Failed`
- `Partially verified`
- `Not testable`
- `Blocked`

Do not mark a test as passed unless it was executed and the expected result was confirmed.

---

## 18. Logging and observability

Every material automation design should define:

- What is logged.
- Where it is logged.
- How duplicate runs are identified.
- How failures are detected.
- Who receives notifications.
- How long evidence remains available.
- How a run can be traced after platform run history expires.
- How client-specific processing can be audited without exposing unnecessary data.

Prefer structured operational logging over relying only on Slack messages or limited platform run history.

---

## 19. Deployment status terminology

Use:

- `Draft`
- `Requirements Confirmed`
- `Design Approved`
- `In Development`
- `Ready for Testing`
- `Testing`
- `Ready for Deployment`
- `Deployed - Pending Validation`
- `Validated`
- `Rolled Back`
- `On Hold`
- `Cancelled`

A change is not complete at `Deployed - Pending Validation`.

---

## 20. Definition of done

A development task is complete only when applicable conditions are met:

- Requirements are confirmed.
- Current state was reviewed.
- Design is documented.
- Implementation is complete.
- Tests were executed.
- Production result was validated.
- Rollback exists.
- Monitoring is defined.
- Stakeholder communication is complete.
- Changelog is updated.
- Handover is complete.
- Canonical documentation updates are identified.
- Canonical documentation is updated after validation.

---

## 21. Template usage

When creating a new project, copy the corresponding files from:

```text
templates/
```

into the new project, instead of creating blank documents:

```text
templates/REQUIREMENTS.template.md
→ projects/<project-slug>/REQUIREMENTS.md

templates/CURRENT_STATE_REFERENCES.template.md
→ projects/<project-slug>/CURRENT_STATE_REFERENCES.md
```

Preserve the template headings and complete all sections that can be completed from available evidence.

Use:

```text
TODO: verify
```

where information is genuinely missing. Do not invent a value to complete a section.

If a required template does not exist:

1. Create the project file using the structure defined in section 7.
2. Record that the corresponding reusable template is missing.
3. Do not silently invent a different structure.

---

## 22. Canonical knowledge update after deployment

After a validated production change, identify updates required in:

```text
../rsfa-technical-knowledge/knowledge/01_RSFA_SYSTEM_MAP.md
../rsfa-technical-knowledge/knowledge/02_SYSTEMS_REGISTRY.md
../rsfa-technical-knowledge/knowledge/03_AUTOMATION_REGISTRY.md
../rsfa-technical-knowledge/knowledge/04_MONDAY_BOARDS_REGISTRY.md
../rsfa-technical-knowledge/knowledge/05_CONTACTS_AND_ROLES.md
../rsfa-technical-knowledge/knowledge/06_NAMING_AND_ID_CONVENTIONS.md
../rsfa-technical-knowledge/knowledge/automations/
../rsfa-technical-knowledge/knowledge/systems/
../rsfa-technical-knowledge/knowledge/schemas/
../rsfa-technical-knowledge/knowledge/playbooks/
../rsfa-technical-knowledge/knowledge/decisions/
../rsfa-technical-knowledge/knowledge/incidents/
```

Do not update canonical documentation to describe proposed behaviour before deployment.

The technical knowledge repository should describe verified current behaviour.

---

## 23. Git workflow

Before making broad changes:

1. Review `git status`.
2. Create a focused branch when appropriate.
3. Keep commits scoped to one purpose.
4. Review the final diff.
5. Check for sensitive information.
6. Use clear commit messages.

Recommended examples:

```text
docs: add email filing logging requirements
feat: add make blueprint for email processing log
test: add duplicate email processing cases
docs: add deployment and rollback plan
fix: correct mortgage masterboard mapping
```

Do not:

- Force-push.
- Rewrite shared history.
- Commit credentials.
- Commit client data.
- Commit temporary exports containing secrets.
- Push or merge unless explicitly requested.

---

## 24. Use of skills and subagents

Use a skill for repeatable procedures such as:

- Consulting the canonical knowledge repository.
- Creating a new automation project.
- Preparing a Make.com change.
- Building a test plan.
- Preparing deployment and rollback.

Use the read-only `rsfa-knowledge-researcher` subagent when a task requires broad research across the technical knowledge repository.

The subagent should:

- Search canonical documentation.
- Identify affected systems and automations.
- Return exact source paths.
- Identify dependencies and gaps.
- Avoid designing or implementing the solution.
- Avoid modifying files or external systems.

The main agent remains responsible for design and implementation.

---

## 25. Communication

Respond to the developer in Spanish unless another language is requested.

Prepare messages for Rod, Kathleen and other RSFA stakeholders in English unless instructed otherwise.

Stakeholder communication should be:

- Clear.
- Concise.
- Professional.
- Honest about uncertainty.
- Explicit about what was checked.
- Explicit about what remains unverified.
- Focused on the next action.

Do not overstate confidence.

---

## 26. Final quality check

Before finishing any material task, confirm:

- Was the canonical knowledge repository consulted?
- Was the correct automation identified?
- Were affected systems and boards identified?
- Were exact IDs preserved?
- Were requirements separated from current behaviour?
- Were assumptions labelled?
- Were dependencies reviewed?
- Were security and privacy considered?
- Was a test plan created?
- Was rollback considered?
- Was production validation performed?
- Were canonical documentation updates identified?
- Was sensitive information excluded?
- Is the result usable by another authorised technical consultant?
- Was the request handled as a project under `projects/<project-slug>/` with the original request preserved in `evidence/original-request.md`?
- Did intake stop before design, and design stop before external writes, unless the user explicitly asked to continue?

Accuracy and recoverability are more important than speed.
