# Test Plan — claude-make-poc

Scope note: the scenario was created on 2026-07-30 (see "Post-creation
tests" below) but is never *run* as part of this task, by design — all
*execution-based* tests remain `Not testable`/out of scope. Structural
validation and creation-state verification (disabled, on-demand, correct
folder) are in scope.

## Structural validation tests (performed)

| Test | Method | Expected result | Actual result | Status |
|---|---|---|---|---|
| Module configuration — `util:BasicTrigger` | `validate_module_configuration` with the candidate `parameters` | `valid: true`, no errors | `{"valid": true, "errors": [], "warnings": []}` | `Passed` |
| Module configuration — `util:SetVariables` | `validate_module_configuration` with the candidate `mapper` | `valid: true`, no errors | `{"valid": true, "errors": [], "warnings": []}` | `Passed` |
| Blueprint schema structure | `validate_blueprint_schema` on the full candidate blueprint | Structurally valid | "Blueprint is valid against the schema." | `Passed` |
| Required external components | `extract_blueprint_components` on the full candidate blueprint | Zero connections, keys, hooks, data stores, data structures | All five lists empty | `Passed` |
| No RSFA data in blueprint | Manual review of `candidate-v1.json` | Only the literal string `"Claude Code MCP proof of concept"` and generic field names | Confirmed | `Passed` |
| No production connection referenced | Manual review of `candidate-v1.json` and `apps_list` results | Only `util:*` modules used, no `connection` field present anywhere | Confirmed | `Passed` |

## Edge cases considered (design-time)

| Case | Handling | Status |
|---|---|---|
| Module name/version mismatch (e.g. `app-modules_list` shows a module that no longer validates) | Would be caught by `validate_module_configuration` returning `errors` | `Passed` (no errors returned) |
| Blueprint missing required top-level fields (`name`, `flow`, `metadata`) | Would be caught by `validate_blueprint_schema` | `Passed` (schema-valid) |
| Accidental reference to a connection-based module | Would surface as a non-empty `connections` array in `extract_blueprint_components` | `Passed` (empty array) |
| Accidental reference to a hook/webhook | Would surface as a non-empty `hooks` array | `Passed` (empty array) |

## Duplicate-prevention checks

Not applicable — the scenario has no trigger driven by external events and
is never run, so there is no possibility of duplicate processing.

## Failure-path tests

`Not testable` — requires the scenario to exist and run in Make, which is
explicitly out of scope until approved and until deployment tooling is
available.

## Downstream validation

Not applicable — the design has no downstream system (no board, no file,
no notification).

## Test-data restrictions

Confirmed: the only "data" in the blueprint is the literal placeholder
string `"Claude Code MCP proof of concept"`. No fictional-but-realistic
client data was needed because the design has no client-facing fields.

## Regression coverage

Not applicable — no existing automation is modified by this project.

## Post-creation tests (performed 2026-07-30)

| Test | Method | Expected result | Actual result | Status |
|---|---|---|---|---|
| Structural re-validation before creation | `validate_blueprint_schema`, `validate_module_configuration` (both modules), `extract_blueprint_components` re-run against `candidate-v1.json` | Same as design-time results | Identical: schema valid, both modules valid, zero connections/keys/hooks/data stores/data structures | `Passed` |
| Scenario created in the `Claude Testing` folder (not elsewhere) | `scenarios_get` (id `9597960`) | `folderId` matches the newly created `Claude Testing` folder id `524015` | `folderId: 524015` | `Passed` |
| Scenario created disabled | `scenarios_get` | `isActive: false` | `isActive: false` | `Passed` |
| Scenario scheduling is "on demand" | `scenarios_get` | `scheduling.type: "on-demand"` | `scheduling: {"type": "on-demand"}` | `Passed` |
| Scenario is never executed | No `scenarios_run` / `executions_list` call made against scenario `9597960` at any point in this task | Scenario has zero executions | Confirmed — `scenarios_run` was never invoked | `Passed` (negative test) |
| Deployed blueprint matches candidate structurally | Manual diff of `created-in-make.json` vs `candidate-v1.json` | Only expected differences (name override, Make-added `scheduling`/`interface` metadata); module flow identical | Confirmed — see diff below | `Passed` |

### Blueprint diff: `candidate-v1.json` vs `created-in-make.json`

- `name`: changed from `"Claude MCP POC - Static Trigger to Variable"` to
  `"M.com: Claude Scenario Creation POC (Jul 2026)"` — deliberate, applied
  at creation time per the approved naming convention (flagged in the
  pre-creation summary before approval).
- `flow` (both modules, all parameters/mapper/metadata): **identical**.
- `metadata.scenario`, `metadata.designer`, `metadata.zone`,
  `metadata.instant`, `metadata.version`: **identical**.
- Two fields present in the deployed blueprint that were absent from the
  candidate — both Make-generated, no functional impact, no new
  connections/resources introduced:
  - `scheduling: {"type": "on-demand"}` (top-level, reflects the
    `scenarios_create` call's `scheduling` argument).
  - `interface: {"input": [], "output": []}` (empty scenario
    input/output interface, Make's default for a scenario with no
    declared MCP-tool interface).
