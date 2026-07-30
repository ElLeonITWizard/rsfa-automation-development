# Design — claude-make-poc

## Proposed architecture

A two-module, connection-free Make scenario that never runs automatically
and is only ever executed manually (on demand) by a human, if at all:

```text
[1] Tools: Basic trigger (util:BasicTrigger)
        |  emits one static bundle: { message: "Claude Code MCP proof of concept" }
        v
[2] Tools: Set multiple variables (util:SetVariables)
        |  sets confirmationMessage = {{1.message}}
        v
      (end)
```

## Systems involved

- Make.com only. No RSFA business system, board, mailbox, or SharePoint
  site is touched.

## Trigger

`util:BasicTrigger` ("Basic trigger"). `moduleType: trigger`,
`triggerType: polling` per live module metadata, but the scenario's
scheduling type will be set to **on demand** so polling never actually
occurs automatically. The bundle content is fixed at design time (no
external input, no webhook, no mailhook).

## Scheduling

On demand only. Interval/automatic scheduling is explicitly turned off,
per the developer's constraint. The scenario is also created **disabled**
so even on-demand runs cannot happen accidentally through the UI.

## Inputs and outputs

- Input: none (the trigger's bundle is a hardcoded value, not real data).
- Output: a scenario-scoped variable (`confirmationMessage`), visible only
  within a scenario execution. Nothing is written to any external system,
  file, board, or mailbox.

## Routing logic

None. Linear two-module flow, no router, no filter, no iterator/aggregator.

## Data mapping

| Target | Source |
|---|---|
| `SetVariables.mapper.variables[0].value` | `{{1.message}}` (BasicTrigger bundle field `message`) |

## Dependencies

None. Both modules belong to the built-in `util` (Tools) app, which has
no connection type.

## Error handling

Not applicable at this scale (two non-failing utility modules, no
external calls). `maxErrors` left at Make's structural default (3) purely
because the blueprint schema expects a value; it has no practical effect
since the scenario is never scheduled to auto-retry.

## Logging

None beyond Make's own execution history, which will not exist because
the scenario is never run (see constraints).

## Security

- No connections, no credentials, no client data anywhere in the
  blueprint.
- Confined to the `Claude Testing` folder once it exists (see
  [CURRENT_STATE_REFERENCES.md](CURRENT_STATE_REFERENCES.md) for the
  current gap).

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| `gateway:CustomWebHook` trigger + `util:SetVariables` action | Also connection-free, but requires creating a hook resource in Make first. The connected MCP tool set has no `hooks_create` tool, making this undeployable through MCP and adding an extra live resource (the hook) beyond the scenario itself — more moving parts than the goal requires. |
| `json:ParseJSON` as the action | Adds no proof value over `SetVariables` for this capability test; `SetVariables` is simpler and equally connection-free. |
| Single-module scenario (trigger only) | Would not demonstrate data flow between modules, which is part of proving Claude can design a real (if minimal) automation, not just a no-op. |

## Risks

- Very low: no production system, connection, or data is touched by the
  design itself.
- The only residual risk is procedural — accidentally invoking a Make
  write tool before approval. Mitigated by stopping this task before any
  write call (see [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)).
