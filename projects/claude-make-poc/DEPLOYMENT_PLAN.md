# Deployment Plan — claude-make-poc

## Status

`Deployed - Pending Validation`. All steps below have been performed.

## Blockers (as of design time — since resolved)

1. ~~Explicit developer approval of [DESIGN.md](DESIGN.md).~~ Given
   2026-07-30 (`APPROVE POC CREATION`).
2. ~~Target folder does not exist.~~ Confirmed still absent immediately
   before deployment (`folders_list` on team `85772` returned only
   `Archive scenarios`, `IT to check`, `Valid scenarios/working`).
   Resolved by creating it via `folders_create` (id `524015`) as part of
   the approved write action.
3. ~~No write-capable Make MCP tool is connected.~~ Resolved: the
   official `make-skills` MCP plugin was installed, exposing
   `scenarios_create`, `folders_create`, and other write-capable tools
   not present in the previously connected read-only Make MCP session.

## Deployment sequence (as executed)

1. Confirmed org `RSFA` (`882256`), team `RSFA ` (`85772`) via
   `organizations_list` / `users_me`.
2. Re-ran `validate_blueprint_schema`, `validate_module_configuration`
   (both modules), `extract_blueprint_components` against
   `candidate-v1.json` — all passed, unchanged from design time.
3. Confirmed `Claude Testing` still did not exist via `folders_list`.
4. Presented a pre-creation summary (org, team, folder-to-be-created,
   scenario name, module sequence, activation/scheduling state, creation
   method, exact resources to be written) and obtained explicit developer
   approval (`APPROVE POC CREATION`, 2026-07-30).
5. Created folder `Claude Testing` (id `524015`) via `folders_create`.
6. Created the scenario via `scenarios_create`, `teamId: 85772`,
   `folderId: 524015`, `scheduling: {"type": "on-demand"}`, using the
   candidate blueprint's flow with `name` overridden to
   `M.com: Claude Scenario Creation POC (Jul 2026)`.
7. Confirmed via `scenarios_get` (scenario id `9597960`) that:
   - `isActive: false`.
   - `scheduling.type: "on-demand"`.
   - `folderId: 524015` (`Claude Testing`).
   - Module sequence unchanged (`util:BasicTrigger` → `util:SetVariables`).
8. Recorded the scenario ID, module IDs, and folder ID in
   [CHANGELOG.md](CHANGELOG.md) and the Implementation Plan.
9. Exported the read-back blueprint to
   `make/blueprints/created-in-make.json` and compared it against
   `candidate-v1.json` (see [TEST_PLAN.md](TEST_PLAN.md) for the diff).
10. Did **not** run the scenario. `scenarios_run` was never invoked.

## Required approvals

- Developer (tech@rsfa.co.nz) sign-off — given explicitly as
  `APPROVE POC CREATION` on 2026-07-30, after reviewing the pre-creation
  summary (including the folder-creation write).

## Scheduling considerations

None — the scenario is on-demand only (`scheduling.type: "on-demand"`,
confirmed via `scenarios_get`) and is never intended to run
automatically, in a window, or at all during this POC.

## Production assets affected

None. Entirely contained to one new folder (`Claude Testing`, id
`524015`) and one new connection-free scenario (id `9597960`) inside it.
No production board, mailbox, connection, or client data was touched.

## Pre-deployment backup

Not applicable — no existing scenario was modified; this is a new,
isolated resource.

## Monitoring window

Not applicable — the scenario has not been and will not be run.

## Post-deployment checks

- `scenarios_get` confirmed `isActive: false` and
  `scheduling: {"type": "on-demand"}`. — `Passed`
- The scenario's `folderId` (`524015`) matches the newly created
  `Claude Testing` folder and no other. — `Passed`
- No execution exists for the scenario (never run). — `Passed` (by
  construction; `scenarios_run` was never called)
