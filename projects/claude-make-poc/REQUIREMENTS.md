# Requirements — claude-make-poc

## Problem

There is no verified evidence of whether Claude Code, working through the
connected Make.com MCP tools, can safely design, structurally validate and
(pending approval) create a Make.com scenario without:

- Using any RSFA production connection.
- Touching RSFA client data.
- Requiring an external app connection at all.
- Escaping an isolated Make folder.

## Stakeholder request

Requested directly by the developer (tech@rsfa.co.nz), 2026-07-30, as a
capability/safety proof before Claude Code is trusted with real Make.com
change work.

## Business objective

Establish confidence that Claude Code can be used for future Make.com
automation work under the constraints defined in this repository's
`CLAUDE.md` (Sections 9, 10), before it is used on production scenarios.

## Functional requirements

- Inspect available Make modules and apps using only read-only MCP tools.
- Propose the smallest valid, connection-free scenario (trigger + one
  action).
- Produce a local candidate blueprint file.
- Structurally validate the blueprint and each module's configuration
  using the Make MCP validation tools before claiming it is valid.
- Identify which IDs/properties Make will generate at creation time.
- Stop before any write action against Make and wait for explicit
  approval.

## Non-functional requirements

- No RSFA client data anywhere in the project.
- No use of Monday, Outlook, SharePoint, Slack, Aircall, or any production
  connection.
- Scenario must be created disabled and with scheduling off (on-demand
  only) if and when it is ever created.
- Scenario must never be run.
- All work confined to the Make folder `Claude Testing`.

## Scope

- Local design, blueprint authoring, and structural validation.
- Documentation of what would be required to create the scenario.

## Out of scope

- Actually creating, enabling, scheduling, or running the scenario in
  Make (requires separate explicit approval — see
  [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md)).
- Any business functionality for RSFA.

## Acceptance criteria

- A candidate blueprint exists at
  `make/blueprints/candidate-v1.json`.
- `validate_blueprint_schema` reports the blueprint as structurally
  valid.
- `validate_module_configuration` reports each module's configuration as
  valid.
- `extract_blueprint_components` reports zero required connections, keys,
  hooks, data stores, and data structures.
- No Make MCP write tool has been invoked.
- The developer has explicitly approved the design before any creation
  attempt.

## Open questions

- `TODO: verify` — The Make folder `Claude Testing` does not currently
  exist under team `RSFA ` (id 85772). Only `Archive scenarios`,
  `IT to check`, and `Valid scenarios/working` were found via
  `folders_list`. See [CURRENT_STATE_REFERENCES.md](CURRENT_STATE_REFERENCES.md).
- `TODO: verify` — The currently connected Make MCP tool set has no
  write-capable tool for creating scenarios, folders, or hooks (confirmed
  by inspecting the full connected tool list). It is unknown whether
  deployment will be performed through this MCP connection, a different
  connection, or manually in the Make UI. See
  [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md).

## Approval status

`Design Approved` pending — awaiting explicit developer sign-off on
[DESIGN.md](DESIGN.md) before any Make write action is attempted.
