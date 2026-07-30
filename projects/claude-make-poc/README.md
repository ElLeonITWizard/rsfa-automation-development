# Project: claude-make-poc

## Purpose

Proof of concept to verify that Claude Code, using the connected Make.com
MCP tools, can safely research, design and structurally validate a minimal
Make.com scenario **without** touching any RSFA production automation,
data, or connection.

This is a capability/safety proof, not a business automation. It has no
functional value to RSFA operations on its own.

## Status

`Ready for Deployment` — design and structural validation complete.
Scenario creation in Make **has not been performed** and requires explicit
approval (see [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md) and the blocker
recorded there).

## Scope

- One local candidate blueprint using only connection-free Make modules
  (`util` / Tools app).
- No RSFA client data, no production boards, no production connections.
- Confined to a dedicated Make folder (`Claude Testing`) once that folder
  exists — see [CURRENT_STATE_REFERENCES.md](CURRENT_STATE_REFERENCES.md).

## Documents

| Document | Purpose |
|---|---|
| [REQUIREMENTS.md](REQUIREMENTS.md) | Problem, objective, acceptance criteria |
| [CURRENT_STATE_REFERENCES.md](CURRENT_STATE_REFERENCES.md) | Live Make org/team/folder/app evidence |
| [DESIGN.md](DESIGN.md) | Chosen modules, data flow, alternatives |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Ordered steps and status |
| [TEST_PLAN.md](TEST_PLAN.md) | Structural validation tests and results |
| [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md) | Deployment sequence, approvals, blockers |
| [ROLLBACK_PLAN.md](ROLLBACK_PLAN.md) | How to remove the scenario if created |
| [CHANGELOG.md](CHANGELOG.md) | Dated change history |
| [HANDOVER.md](HANDOVER.md) | Final behaviour and outstanding tasks |

## Blueprint

Candidate blueprint (local only, not yet created in Make):

```text
make/blueprints/candidate-v1.json
```
