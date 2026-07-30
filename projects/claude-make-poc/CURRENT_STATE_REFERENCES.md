# Current State References — claude-make-poc

This project has no canonical automation ID because it is not an RSFA
business automation. References below are live-system evidence gathered
via the connected Make.com MCP tools (read-only calls only).

## Make organisation / team

`Confirmed from live system` (2026-07-30, via `organizations_list`,
`folders_list`):

- Organisation: `RSFA`, id `882256`, zone `eu2.make.com`, plan `Pro`.
- Team: `RSFA ` (note trailing space in the live name), id `85772`.
- This is the only organisation/team visible to the connected MCP token.

## Target folder

`Confirmed from live system` (2026-07-30, via `folders_list` for team
`85772`):

| Folder | id | scenarios |
|---|---|---|
| Archive scenarios | 287956 | 17 |
| IT to check | 296568 | 0 |
| Valid scenarios/working | 296569 | 38 |

**The folder `Claude Testing` does not exist.** The developer's
instruction to confine all work to that folder assumes it already exists.
`TODO: verify` with the developer whether:

- the folder should be created manually in the Make UI before any
  scenario creation is attempted, or
- it already exists under a different name/parent than assumed.

No folder was created by this project. The connected MCP tool set has no
`folders_create` tool in any case (see below).

## Make MCP tool capability (read vs. write)

`Confirmed from live system` (2026-07-30, by inspecting the full list of
connected `mcp__claude_ai_Make__*` tools):

- Available: listing/reading organisations, teams, folders, scenarios,
  blueprints, apps, app modules, connections, hooks (read), executions,
  and all `validate_*` / `extract_*` structural tools.
- **Not available in this connection:** `scenarios_create`,
  `scenarios_update`, any scenario enable/disable or run tool,
  `hooks_create`/`hooks_update`, `folders_create`. These are referenced by
  name in other tools' documentation (implying they exist in the broader
  Make MCP surface) but are not present among the tools connected to this
  session.
- This means **deployment (Step 7 onward) cannot be performed through
  this MCP connection today**, regardless of approval. See
  [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md).

## Apps and modules used in the candidate design

`Confirmed from live system` (2026-07-30, via `apps_list`,
`app-modules_list`, `app-module_get` for organisation `882256`):

- App `util` ("Tools"), version 1 — connection-free (no `connection`
  field in any of its modules).
  - Module `BasicTrigger` ("Basic trigger") — `moduleType: trigger`,
    `triggerType: polling`. Emits a static, user-defined bundle. No
    external connection, no hook, no data store.
  - Module `SetVariables` ("Set multiple variables") — `moduleType:
    action`. No external connection.
- App `gateway` ("Webhooks") was reviewed and **rejected** for this POC:
  its trigger modules (`CustomWebHook`, `CustomMailHook`,
  `CustomTrigger`) require a hook resource to be created in Make first,
  and this connection has no `hooks_create` tool. Using it would make the
  design impossible to deploy through the current MCP connection.

## Related documents

- [REQUIREMENTS.md](REQUIREMENTS.md)
- [DESIGN.md](DESIGN.md)
- [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md)

## Discrepancies requiring verification

- Assumed folder `Claude Testing` vs. live folder list — see above.
- Assumed write-capable Make MCP tools exist for this session vs.
  confirmed absence — see above.
