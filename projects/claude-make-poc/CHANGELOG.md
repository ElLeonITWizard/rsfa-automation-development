# Changelog — claude-make-poc

## 2026-07-30 (deployment)

**What changed:** The official `make-skills` MCP plugin was installed,
exposing write-capable Make MCP tools (`folders_create`,
`scenarios_create`, etc.) that were absent from the previously connected
read-only MCP session. Re-ran all structural validations against
`candidate-v1.json` (`validate_blueprint_schema`,
`validate_module_configuration` for both modules,
`extract_blueprint_components`) — all passed, unchanged from the
design-time results. Confirmed org (`RSFA`, id `882256`) and team
(`RSFA `, id `85772`) live. Confirmed the `Claude Testing` folder still
did not exist, presented a pre-creation summary (including that folder
creation was required), and received explicit developer approval
(`APPROVE POC CREATION`). Created folder `Claude Testing` (id `524015`)
via `folders_create`. Created the scenario via `scenarios_create` with
`scheduling: {"type": "on-demand"}` in that folder, using the candidate
blueprint's module flow with the `name` field overridden to
`M.com: Claude Scenario Creation POC (Jul 2026)` to match the approved
naming convention. Read the scenario back via `scenarios_get` and
confirmed `isActive: false`, `scheduling.type: "on-demand"`,
`folderId: 524015`, and an unchanged module sequence. Exported the
deployed blueprint to `make/blueprints/created-in-make.json`. The
scenario was **not** run — `scenarios_run` was never invoked.

**Why:** Developer-requested proof of concept that Claude Code can safely
design and create a Make.com scenario under the safety constraints in
this repository's `CLAUDE.md`, once explicitly approved.

**Status:** `Deployed - Pending Validation`. Structural creation is
complete and read-back confirmed; this is not yet `Validated` per
`CLAUDE.md` Section 18 terminology, since "validated" here would require
an intentional decision on whether the scenario is ever run (it is
designed never to be run — see [HANDOVER.md](HANDOVER.md)).

**Deployment result:**

- Organisation: `RSFA`, id `882256`.
- Team: `RSFA `, id `85772`.
- Folder: `Claude Testing`, id `524015` (newly created).
- Scenario: `M.com: Claude Scenario Creation POC (Jul 2026)`, id
  `9597960`.
- Module IDs: `1` (`util:BasicTrigger`), `2` (`util:SetVariables`).
- `isActive: false`, `scheduling: {"type": "on-demand"}`.

**Validation result:** All structural validations re-passed pre-creation
(see [TEST_PLAN.md](TEST_PLAN.md)). Post-creation read-back via
`scenarios_get` confirmed disabled state, on-demand scheduling, correct
folder, and correct module sequence. The scenario has never been run — no
executions exist.

**Remaining work:**

- None to reach `Deployed - Pending Validation`. Promoting to `Validated`
  would require a deliberate decision on running the scenario at least
  once, which is out of scope by design (see
  [ROLLBACK_PLAN.md](ROLLBACK_PLAN.md) for removal if ever needed).

## 2026-07-30 (design)

**What changed:** Project created. Inspected available Make.com MCP
tools, organisation/team/folder state, and connection-free apps/modules
(read-only). Designed a minimal two-module, connection-free candidate
scenario (`util:BasicTrigger` → `util:SetVariables`). Wrote the candidate
blueprint to `make/blueprints/candidate-v1.json`. Structurally validated
it with `validate_module_configuration` (both modules),
`validate_blueprint_schema`, and `extract_blueprint_components` — all
passed with zero required connections/keys/hooks/data stores/data
structures. Wrote all required project documents.

**Why:** Developer-requested proof of concept that Claude Code can safely
design and (pending separate approval) create a Make.com scenario under
the safety constraints in this repository's `CLAUDE.md`.

**Status:** `Ready for Deployment` for the design/validation portion.
Deployment itself was `On Hold` at this point — see blockers below
(resolved in the deployment entry above).

**Deployment result:** Not deployed at this point. No Make MCP write tool
had been invoked yet.

**Validation result:** All structural validations passed (see
[TEST_PLAN.md](TEST_PLAN.md)). No live/behavioural validation was
possible yet since nothing had been created or run.

**Remaining work (at this point, since resolved):**

- Developer approval of [DESIGN.md](DESIGN.md).
- Resolve the missing `Claude Testing` folder (did not exist under team
  `RSFA ` / id `85772`).
- Resolve the absence of any write-capable Make scenario-creation tool in
  the then-connected MCP tool set.
- Once unblocked: create the scenario disabled, on-demand scheduling
  only, and record the generated scenario/module/folder IDs here.
