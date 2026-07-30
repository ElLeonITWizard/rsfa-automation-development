# Implementation Plan — claude-make-poc

## Ordered steps

1. **Inspect Make modules and folders** (read-only MCP calls). — `Done`
   - `organizations_list`, `folders_list`, `apps_list`,
     `app-modules_list`, `app-module_get`.
2. **Propose smallest valid connection-free scenario.** — `Done`
   - `util:BasicTrigger` → `util:SetVariables`.
3. **Write DESIGN.md and TEST_PLAN.md.** — `Done`
4. **Generate candidate blueprint locally** at
   `make/blueprints/candidate-v1.json`. — `Done`
5. **Validate the candidate structurally**, without creating anything in
   Make. — `Done`
   - `validate_module_configuration` (both modules): valid, no errors, no
     warnings.
   - `validate_blueprint_schema`: "Blueprint is valid against the
     schema."
   - `extract_blueprint_components`: zero connections, keys, hooks, data
     stores, data structures required.
6. **Document which IDs/properties Make must generate at creation time.**
   — `Done` (see below).
7. **Stop and request explicit developer approval** before invoking any
   Make MCP write tool. — `Done` (this is the current state; no write
   tool has been called).
8. *(Blocked, pending approval and tool availability)* Create the
   scenario in Make, disabled, on-demand scheduling, inside `Claude
   Testing`.
9. *(Blocked)* Record the created scenario ID, module IDs, and folder ID
   in this document and in [CHANGELOG.md](CHANGELOG.md).
10. *(Blocked)* Confirm the scenario remains disabled and is never run.

## Files and platform assets affected

- `projects/claude-make-poc/` (this repo only).
- No production repository, board, or file is touched.
- Pending step 8 only: one new scenario inside the Make folder `Claude
  Testing` (folder itself does not currently exist — see
  [CURRENT_STATE_REFERENCES.md](CURRENT_STATE_REFERENCES.md)).

## Required access

- Read-only Make MCP access (already available and used).
- For step 8+: a Make MCP tool capable of creating a scenario, and
  confirmation of/creation of the `Claude Testing` folder. **Neither is
  currently available in this MCP connection.**

## Preconditions for step 8 (not yet met)

- Developer has explicitly approved [DESIGN.md](DESIGN.md).
- `Claude Testing` folder exists (or the developer clarifies where it
  should be created and by whom).
- A write-capable Make scenario-creation tool is available to this
  session.

## Dependencies

- None beyond the two preconditions above.

## Review points

- Before step 8: developer approval (mandatory per task constraints).
- After step 8 (if ever reached): confirm via `scenarios_get` that the
  scenario is disabled and scheduling is "on demand" before considering
  the task any further advanced than `Deployed - Pending Validation`.

## Implementation status

`Ready for Deployment` for steps 1–7. Steps 8–10 are `On Hold` pending
developer approval and confirmation of the folder/tooling gap.
