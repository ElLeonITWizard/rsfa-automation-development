"""Generates the two candidate Make blueprints for this project (local only, NOT imported into Make).

  make/blueprints/cp-rename-cascade.candidate-v1.json
      New scenario "M.com: Related Assets Renaming after Client Profile Rename (Nov 2026)".
  make/blueprints/lead-rename-by-client-profile.candidate-v1.json
      Completes the existing INACTIVE shell 9711585 "M.com: Lead Rename by ClientProfile (Mar 2026)".

Sources of truth: make/code/rename-planner.js (Code module body) and make/queries/*.graphql
(regenerate them first with make/queries/build_queries.py). No webhook URL or secret is written:
the cascade's webhook is the placeholder 0 until RSFA creates the hook at deployment (DEPLOYMENT_PLAN.md).

Run: python3 make/build_blueprints.py
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
MONDAY_CONN = 240128          # "My Monday v2 connection - 1" (Confirmed from live system: used by 8410524, 9447215)
ERROR_SCENARIO = "SCN_8732008"  # Outlook: Email Notification after Failed Scenario (COMP-MAKE-ERROR-001)
ALERT_TO = "tech@rsfa.co.nz"
CP_BOARD = 5024661649
LEADS_BOARD = 2074688480
LEAD_CP_COLUMN = "board_relation_mm7c1wcw"

PLANNER = (HERE / "code" / "rename-planner.js").read_text()
PROFILE_QUERY = (HERE / "queries" / "client-profile.graphql").read_text().strip()
ASSETS_QUERY = (HERE / "queries" / "related-assets.graphql").read_text().strip()
for q in (PROFILE_QUERY, ASSETS_QUERY):
    assert "{{" not in q and "}}" not in q, "query text must not contain Make mapping delimiters"


def gql_module(mid, label, query, variables=None, x=0, y=0):
    m = {
        "id": mid,
        "module": "monday:ExecuteGraphQLQueryV2",
        "version": 2,
        "parameters": {"__IMTCONN__": MONDAY_CONN},
        "mapper": {"method": "POST", "queryBody": query, "variablesDataSource": "array",
                   "variables": variables or []},
        "metadata": {"designer": {"x": x, "y": y, "name": label},
                     "restore": {"parameters": {"__IMTCONN__": {"label": "My Monday v2 connection - 1",
                                                                "data": {"scoped": "true", "connection": "monday"}}}}},
    }
    return m


def notify(mid, message, x=0, y=0):
    return {
        "id": mid,
        "module": "scenario-service:CallSubscenario",
        "version": 2,
        "parameters": {"scenario": ERROR_SCENARIO, "shouldWaitForExecutionEnd": True},
        "mapper": {"data": {"ScenarioURL": "{{var.scenario.url}}", "ScenarioName": "{{var.scenario.name}}",
                            "ToRecipients": ALERT_TO, "ErrorMessage": message}},
        "metadata": {"designer": {"x": x, "y": y, "name": "Error Notification Email"},
                     "restore": {"parameters": {"scenario": {"label": "Outlook: Email Notification after Failed Scenario"}}}},
    }


def ignore(mid, x=0, y=0):
    return {"id": mid, "module": "builtin:Ignore", "version": 1, "metadata": {"designer": {"x": x, "y": y}}}


def webhook(mid, hook, label):
    return {
        "id": mid, "module": "gateway:CustomWebHook", "version": 1,
        "parameters": {"hook": hook, "maxResults": 1},
        "mapper": {},
        "metadata": {"designer": {"x": 0, "y": 0},
                     "restore": {"parameters": {"hook": {"data": {"editable": "true"}, "label": label}}}},
    }


def challenge_route(mid):
    # Monday sends {"challenge": "..."} once when a webhook is registered and expects it echoed back.
    return {"flow": [{
        "id": mid, "module": "gateway:WebhookRespond", "version": 1, "parameters": {},
        "mapper": {"status": 200, "body": '{"challenge":"{{1.challenge}}"}',
                   "headers": [{"key": "Content-Type", "value": "application/json"}]},
        "filter": {"name": "monday.com verification challenge",
                   "conditions": [[{"a": '{{ifempty(1.challenge; "")}}', "b": "", "o": "text:notequal"}]]},
        "metadata": {"designer": {"x": 600, "y": -300}},
    }]}


SCENARIO_META = {
    "instant": True, "version": 1, "designer": {"orphans": []},
    # sequential: webhook bundles are processed one at a time, so two renames of the same profile never race.
    "scenario": {"roundtrips": 1, "maxErrors": 3, "autoCommit": True, "autoCommitTriggerLast": True,
                 "sequential": True, "confidential": False, "dataloss": False, "dlq": False, "freshVariables": False},
}

PULSE = "{{1.event.pulseId}}"
PROFILE = "4.body.data.items[1]"


def cascade():
    assets_query = (ASSETS_QUERY
                    .replace("__PROFILE_ID__", "{{" + PROFILE + ".id}}")
                    .replace("__CONTACT_IDS__", '{{ifempty(join(' + PROFILE + '.contacts[1].linked_item_ids; ","); "0")}}'))
    profile_query = PROFILE_QUERY.replace("query ($ids: [ID!]) { items(ids: $ids)", "query { items(ids: [" + PULSE + "])")
    assert "$ids" not in profile_query

    rename_flow = [
        {"id": 8, "module": "builtin:BasicFeeder", "version": 1, "mapper": {"array": "{{6.result.renames}}"},
         "metadata": {"designer": {"x": 2100, "y": 0, "name": "Each planned rename"}, "restore": {"expect": {"array": {"mode": "edit"}}}}},
        dict(gql_module(9, "Rename item",
                        "mutation ($b: ID!, $i: ID!, $v: String!) { change_simple_column_value(board_id: $b, item_id: $i, column_id: \"name\", value: $v) { id } }",
                        [{"key": "b", "value": "{{8.boardId}}"}, {"key": "i", "value": "{{8.itemId}}"},
                         {"key": "v", "value": "{{8.newName}}"}], 2400, 0),
             onerror=[notify(10, "Client Profile rename cascade: renaming item <b>{{8.itemId}}</b> on board <b>{{8.boardId}}</b> "
                                 "(rule {{8.rule}}) after Client Profile <b>" + PULSE + "</b> was renamed failed. "
                                 "{{9.error.message}}. Other items continue; re-run by re-sending the event (see HANDOVER.md).",
                             2400, 300), ignore(11, 2700, 300)]),
    ]
    alert_flow = [notify(
        12, "Client Profile rename cascade for profile <b>" + PULSE + "</b> needs review. "
            "Abort code: <b>{{ifempty(6.result.abort; \"none\")}}</b>. Truncated lookups (over 500 items): "
            "<b>{{ifempty(join(6.result.truncated; \", \"); \"none\")}}</b>. Planned renames: {{ifempty(6.result.counts.planned; length(6.result.renames))}}. "
            "When aborted, nothing was renamed.", 2100, 300)]
    alert_flow[0]["filter"] = {"name": "Aborted or truncated", "conditions": [
        [{"a": "{{6.result.abort}}", "o": "exist"}],
        [{"a": "{{length(6.result.truncated)}}", "b": "0", "o": "number:greater"}]]}
    rename_flow[0]["filter"] = {"name": "Plan OK and has renames", "conditions": [[
        {"a": "{{6.result.ok}}", "b": "true", "o": "boolean:equal"},
        {"a": "{{length(6.result.renames)}}", "b": "0", "o": "number:greater"}]]}

    event_flow = [
        dict(gql_module(4, "Read Client Profile", profile_query, [], 600, 0),
             filter={"name": "Client Profile name changed", "conditions": [[
                 {"a": '{{ifempty(1.challenge; "")}}', "b": "", "o": "text:equal"},
                 {"a": "{{1.event.boardId}}", "b": str(CP_BOARD), "o": "text:equal"},
                 {"a": PULSE, "b": "^[0-9]{1,20}$", "o": "text:pattern"},
                 {"a": "{{1.event.type}}", "b": "^(update_name|change_name|manual_rerun)$", "o": "text:pattern"}]]},
             onerror=[notify(13, "Client Profile rename cascade: reading Client Profile <b>" + PULSE + "</b> failed. "
                                 "{{4.error.message}}. Nothing was renamed.", 600, 300), ignore(14, 900, 300)]),
        dict(gql_module(5, "Read related assets (15 lookups)", assets_query, [], 900, 0),
             filter={"name": "Profile found", "conditions": [[{"a": "{{" + PROFILE + ".id}}", "o": "exist"}]]},
             onerror=[notify(15, "Client Profile rename cascade: reading the related assets of Client Profile <b>" + PULSE + "</b> failed. "
                                 "{{5.error.message}}. Nothing was renamed.", 900, 300), ignore(16, 1200, 300)]),
        {"id": 6, "module": "code:ExecuteCode", "version": 1, "parameters": {},
         "mapper": {"language": "javascript", "inputFormat": "editor", "codeEditorJavascript": PLANNER,
                    "input": [{"name": "profile", "value": "{{4.body.data}}"},
                              {"name": "assets", "value": "{{5.body.data}}"},
                              {"name": "eventItemId", "value": PULSE},
                              {"name": "maxRenames", "value": "150"}]},
         "metadata": {"designer": {"x": 1200, "y": 0, "name": "Plan renames (rename-planner.js)"}},
         "onerror": [notify(17, "Client Profile rename cascade: planning failed for Client Profile <b>" + PULSE + "</b>. "
                                "{{6.error.message}}. Nothing was renamed.", 1200, 300), ignore(18, 1500, 300)]},
        {"id": 7, "module": "builtin:BasicRouter", "version": 1, "mapper": None,
         "metadata": {"designer": {"x": 1500, "y": 0}},
         "routes": [{"flow": rename_flow}, {"flow": alert_flow}]},
    ]
    return {
        "name": "M.com: Related Assets Renaming after Client Profile Rename (Nov 2026)",
        "flow": [webhook(1, 0, "TODO: create at deployment - CP Rename Cascade Webhook"),
                 {"id": 2, "module": "builtin:BasicRouter", "version": 1, "mapper": None,
                  "metadata": {"designer": {"x": 300, "y": 0}},
                  "routes": [challenge_route(3), {"flow": event_flow}]}],
        "metadata": SCENARIO_META,
    }


def lead_rename():
    lead = "3.body.data.items[1]"
    cp_rel = lead + ".cp[1]"
    query = ("query { items(ids: [" + PULSE + "]) { id name state board { id } "
             'cp: column_values(ids: ["' + LEAD_CP_COLUMN + '"]) { ... on BoardRelationValue { linked_item_ids linked_items { id name state } } } } }')
    target = "{{trim(" + cp_rel + ".linked_items[1].name)}}"
    event_flow = [
        dict(gql_module(3, "Read Lead and its Client Profile", query, [], 600, 0),
             filter={"name": "Lead Client Profiles column changed", "conditions": [[
                 {"a": '{{ifempty(1.challenge; "")}}', "b": "", "o": "text:equal"},
                 {"a": "{{1.event.boardId}}", "b": str(LEADS_BOARD), "o": "text:equal"},
                 {"a": "{{1.event.columnId}}", "b": LEAD_CP_COLUMN, "o": "text:equal"},
                 {"a": PULSE, "b": "^[0-9]{1,20}$", "o": "text:pattern"}]]},
             onerror=[notify(5, "Lead rename by Client Profile: reading Lead <b>" + PULSE + "</b> failed. {{3.error.message}}.", 600, 300),
                      ignore(6, 900, 300)]),
        dict(gql_module(4, "Rename Lead to its Client Profile",
                        "mutation ($i: ID!, $v: String!) { change_simple_column_value(board_id: " + str(LEADS_BOARD) +
                        ", item_id: $i, column_id: \"name\", value: $v) { id } }",
                        [{"key": "i", "value": "{{" + lead + ".id}}"}, {"key": "v", "value": target}], 900, 0),
             filter={"name": "Exactly one active Client Profile, name differs", "conditions": [[
                 {"a": "{{" + lead + ".board.id}}", "b": str(LEADS_BOARD), "o": "text:equal"},
                 {"a": "{{" + lead + ".state}}", "b": "active", "o": "text:equal"},
                 {"a": "{{length(" + cp_rel + ".linked_item_ids)}}", "b": "1", "o": "number:equal"},
                 {"a": "{{" + cp_rel + ".linked_items[1].state}}", "b": "active", "o": "text:equal"},
                 {"a": target, "b": "", "o": "text:notequal"},
                 {"a": "{{length(" + target[2:-2] + ")}}", "b": "255", "o": "number:lessorequal"},
                 {"a": target, "b": "{{" + lead + ".name}}", "o": "text:notequal"}]]},
             onerror=[notify(7, "Lead rename by Client Profile: renaming Lead <b>" + PULSE + "</b> failed. {{4.error.message}}.", 900, 300),
                      ignore(8, 1200, 300)]),
    ]
    return {
        "name": "M.com: Lead Rename by ClientProfile (Mar 2026)",
        "flow": [webhook(1, 4335040, "New Lead webhook"),
                 {"id": 2, "module": "builtin:BasicRouter", "version": 1, "mapper": None,
                  "metadata": {"designer": {"x": 300, "y": 0}},
                  "routes": [challenge_route(9), {"flow": event_flow}]}],
        "metadata": SCENARIO_META,
    }


if __name__ == "__main__":
    out = HERE / "blueprints"
    out.mkdir(exist_ok=True)
    for name, bp in (("cp-rename-cascade.candidate-v1.json", cascade()),
                     ("lead-rename-by-client-profile.candidate-v1.json", lead_rename())):
        (out / name).write_text(json.dumps(bp, indent=2, ensure_ascii=False) + "\n")
        print("wrote", out / name)
