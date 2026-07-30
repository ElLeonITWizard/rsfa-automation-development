# Handover — claude-make-poc

## Final behaviour

As of 2026-07-30, this POC has been **created in Make** following
explicit developer approval (`APPROVE POC CREATION`):

- Organisation: `RSFA` (`882256`), team `RSFA ` (`85772`).
- Folder: `Claude Testing`, id `524015` (newly created — did not exist
  before this task).
- Scenario: `M.com: Claude Scenario Creation POC (Jul 2026)`, id
  `9597960`.
- Modules: `util:BasicTrigger` (id `1`) → `util:SetVariables` (id `2`),
  no external connection.
- State: **disabled** (`isActive: false`), scheduling **on-demand**
  (`{"type": "on-demand"}`).
- **The scenario has never been run.** No Make MCP write tool other than
  `folders_create` and `scenarios_create` was ever invoked; `scenarios_run`
  was never called.

The deployed blueprint was exported to
`make/blueprints/created-in-make.json` and compared against
`make/blueprints/candidate-v1.json` — identical module flow, with only
the expected `name` override and Make-added `scheduling`/`interface`
metadata (see [TEST_PLAN.md](TEST_PLAN.md) for the full diff).

## Maintenance procedure

Keep the scenario disabled and on-demand-only unless a future task
explicitly changes that with its own approval and plan (per
[ROLLBACK_PLAN.md](ROLLBACK_PLAN.md), any deviation — enabled, scheduled,
or executed — is itself a rollback trigger). No routine maintenance is
otherwise required; the scenario does nothing and touches nothing.

## Known limitations

- This POC has no business function. It exists solely as a
  capability/safety proof that Claude Code, via the official Make Skills
  MCP plugin, can design, validate, and (with explicit approval) create a
  connection-free Make scenario without touching RSFA production
  systems.
- The write-capable Make MCP tools used here
  (`mcp__plugin_make-skills_make__folders_create`,
  `mcp__plugin_make-skills_make__scenarios_create`) come from the
  separately installed `make-skills` plugin, not the previously connected
  read-only Make MCP session referenced earlier in this project's
  documents. Future Make work in this repo should note which MCP
  connection/tool set is in use, since capability differs between them.

## Monitoring

Not applicable — the scenario is disabled, unscheduled, and has never
executed, so there is no run history to monitor.

## Manual recovery

Not applicable — nothing has failed; nothing runs. If removal is ever
needed, follow [ROLLBACK_PLAN.md](ROLLBACK_PLAN.md) (disable if not
already disabled, then delete scenario `9597960`, optionally remove
folder `524015` if left empty).

## Canonical documentation updated

None. Per `CLAUDE.md` (this repo, Section 20) and the technical-knowledge
repo's own rules, canonical documentation is only updated after a
*validated production change*. This POC is not a production automation
and has no business function — it remains documented only here.

## Outstanding tasks

None required to close out this POC. If a decision is later made to
retire it, follow [ROLLBACK_PLAN.md](ROLLBACK_PLAN.md) and record the
removal in [CHANGELOG.md](CHANGELOG.md).
