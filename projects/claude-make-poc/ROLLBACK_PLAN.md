# Rollback Plan — claude-make-poc

## Status

Not yet applicable — the scenario has not been created. This plan is
prepared in advance per [CLAUDE.md](../../CLAUDE.md) Section 10
("Before deployment... Define rollback").

## Rollback trigger

Any of:

- The scenario is found outside the `Claude Testing` folder.
- The scenario is found enabled, or with scheduling other than on
  demand.
- The scenario is found to have executed.
- The developer withdraws approval for any reason.

## Previous known-good state

There is no previous state to restore — this is a brand-new, isolated
scenario with no prior version. "Rollback" here means **complete
removal**, not reversion to an earlier blueprint.

## Backup or export location

The only artefact that matters is the local candidate blueprint already
committed to this repository:

```text
make/blueprints/candidate-v1.json
```

If the scenario is ever created and later modified in the Make UI, export
the live blueprint first to `make/blueprints/deployed-<date>.json` before
making further changes, so this local record stays traceable.

## Reversal steps

1. Confirm the scenario ID from [CHANGELOG.md](CHANGELOG.md) /
   [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).
2. Disable the scenario if it is not already disabled.
3. Delete the scenario from Make (manually in the Make UI, or via a
   write-capable MCP tool once available — this connection currently has
   none).
4. Confirm via `scenarios_list`/`scenarios_get` that the scenario no
   longer exists.
5. Update [CHANGELOG.md](CHANGELOG.md) and
   [HANDOVER.md](HANDOVER.md) to record the removal and reason.

## Data reconciliation

Not applicable — the scenario produces no external data, so there is
nothing to reconcile.

## Validation after rollback

- `scenarios_list` for team `85772` no longer returns the scenario.
- The `Claude Testing` folder's scenario count decreases by one (or the
  folder becomes empty again, if it was created solely for this POC).
