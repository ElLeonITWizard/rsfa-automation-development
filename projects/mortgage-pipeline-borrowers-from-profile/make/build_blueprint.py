"""Generates make/blueprints/mp-borrowers-from-profile.candidate-v1.json for
"M.com: Mortgage Pipeline Borrowers from Client Profile (Nov 2026)". The hook is the placeholder 0 until created.

Run: python3 make/build_blueprint.py
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
MONDAY_CONN = 240128
ERROR_SCENARIO = "SCN_8732008"
ALERT_TO = "tech@rsfa.co.nz"
MP_BOARD = 5025201889
WAIT_S = 5  # 9756260 sets the Lead and Client Profile links in the create call; a short wait is a safety margin

CODE = (HERE / "code" / "borrowers-from-profile.js").read_text()
assert "{" + "{" not in CODE and "}" + "}" not in CODE
PULSE = "{{1.event.pulseId}}"


def gql(mid, label, query, variables, x, y):
    return {"id": mid, "module": "monday:ExecuteGraphQLQueryV2", "version": 2, "parameters": {"__IMTCONN__": MONDAY_CONN},
            "mapper": {"method": "POST", "queryBody": query, "variablesDataSource": "array", "variables": variables},
            "metadata": {"designer": {"x": x, "y": y, "name": label},
                         "restore": {"parameters": {"__IMTCONN__": {"label": "My Monday v2 connection - 1",
                                                                    "data": {"scoped": "true", "connection": "monday"}}}}}}


def notify(mid, message, x, y):
    return {"id": mid, "module": "scenario-service:CallSubscenario", "version": 2,
            "parameters": {"scenario": ERROR_SCENARIO, "shouldWaitForExecutionEnd": True},
            "mapper": {"data": {"ScenarioURL": "{{var.scenario.url}}", "ScenarioName": "{{var.scenario.name}}",
                                "ToRecipients": ALERT_TO, "ErrorMessage": message}},
            "metadata": {"designer": {"x": x, "y": y, "name": "Error Notification Email"},
                         "restore": {"parameters": {"scenario": {"label": "Outlook: Email Notification after Failed Scenario"}}}}}


def ignore(mid, x, y):
    return {"id": mid, "module": "builtin:Ignore", "version": 1, "metadata": {"designer": {"x": x, "y": y}}}


REL = "... on BoardRelationValue { linked_item_ids }"
READ = ("query { items(ids: [" + PULSE + "]) { id name state board { id } "
        'lead: column_values(ids: ["board_relation_mkyaz0ej"]) { ' + REL + " } "
        'borrowers: column_values(ids: ["board_relation_mkyf123a"]) { ' + REL + " } "
        'profile: column_values(ids: ["board_relation_mkyercdt"]) { ... on BoardRelationValue { linked_item_ids '
        'linked_items { id state contacts: column_values(ids: ["board_relation38"]) { '
        "... on BoardRelationValue { linked_item_ids display_value } } } } } } }")
assert "{{" not in READ.replace(PULSE, "") and "}}" not in READ.replace(PULSE, "")


def blueprint():
    event_flow = [
        {"id": 3, "module": "util:FunctionSleep", "version": 1, "parameters": {}, "mapper": {"duration": str(WAIT_S)},
         "filter": {"name": "Mortgage Pipeline item created", "conditions": [[
             {"a": '{{ifempty(1.challenge; "")}}', "b": "", "o": "text:equal"},
             {"a": "{{1.event.boardId}}", "b": str(MP_BOARD), "o": "text:equal"},
             {"a": PULSE, "b": "^[0-9]{1,20}$", "o": "text:pattern"},
             {"a": "{{1.event.type}}", "b": "^(create_pulse|manual_rerun)$", "o": "text:pattern"}]]},
         "metadata": {"designer": {"x": 600, "y": 0, "name": "Wait 5 s"}}},
        dict(gql(4, "Read item, Lead, Borrowers, Client Profile contacts", READ, [], 900, 0),
             onerror=[notify(9, "Mortgage Pipeline Borrowers: reading item <b>" + PULSE + "</b> failed. {{4.error.message}}. Nothing changed.", 900, 300),
                      ignore(10, 1200, 300)]),
        {"id": 5, "module": "code:ExecuteCode", "version": 1, "parameters": {},
         "mapper": {"language": "javascript", "inputFormat": "editor", "codeEditorJavascript": CODE,
                    "input": [{"name": "item", "value": "{{4.body.data}}"}, {"name": "eventItemId", "value": PULSE}]},
         "metadata": {"designer": {"x": 1200, "y": 0, "name": "Plan Borrowers (borrowers-from-profile.js)"}},
         "onerror": [notify(11, "Mortgage Pipeline Borrowers: planning failed for item <b>" + PULSE + "</b>. {{5.error.message}}. Nothing changed.", 1200, 300),
                     ignore(12, 1500, 300)]},
        dict(gql(6, "Set Borrowers and name",
                 "mutation ($i: ID!, $cv: JSON!) { change_multiple_column_values(board_id: " + str(MP_BOARD)
                 + ", item_id: $i, column_values: $cv) { id } }",
                 [{"key": "i", "value": "{{5.result.itemId}}"}, {"key": "cv", "value": "{{5.result.columnValues}}"}], 1500, 0),
             filter={"name": "Fill needed", "conditions": [[{"a": "{{5.result.action}}", "b": "fill", "o": "text:equal"}]]},
             onerror=[notify(7, "Mortgage Pipeline Borrowers: setting Borrowers on item <b>" + PULSE + "</b> failed. {{6.error.message}}.", 1500, 300),
                      ignore(8, 1800, 300)]),
    ]
    challenge = {"flow": [{
        "id": 13, "module": "gateway:WebhookRespond", "version": 1, "parameters": {},
        "mapper": {"status": 200, "body": '{"challenge":"{{1.challenge}}"}', "headers": [{"key": "Content-Type", "value": "application/json"}]},
        "filter": {"name": "monday.com verification challenge", "conditions": [[{"a": '{{ifempty(1.challenge; "")}}', "b": "", "o": "text:notequal"}]]},
        "metadata": {"designer": {"x": 600, "y": -300}}}]}
    return {
        "name": "M.com: Mortgage Pipeline Borrowers from Client Profile (Nov 2026)",
        "flow": [{"id": 1, "module": "gateway:CustomWebHook", "version": 1, "parameters": {"hook": 0, "maxResults": 1}, "mapper": {},
                  "metadata": {"designer": {"x": 0, "y": 0}, "restore": {"parameters": {"hook": {"data": {"editable": "true"},
                                                                                            "label": "TODO: create at deployment"}}}}},
                 {"id": 2, "module": "builtin:BasicRouter", "version": 1, "mapper": None, "metadata": {"designer": {"x": 300, "y": 0}},
                  "routes": [challenge, {"flow": event_flow}]}],
        # sequential MUST stay False (Monday webhook challenge).
        "metadata": {"instant": True, "version": 1, "designer": {"orphans": []},
                     "scenario": {"roundtrips": 1, "maxErrors": 3, "autoCommit": True, "autoCommitTriggerLast": True,
                                  "sequential": False, "confidential": False, "dataloss": False, "dlq": False, "freshVariables": False}},
    }


if __name__ == "__main__":
    out = HERE / "blueprints" / "mp-borrowers-from-profile.candidate-v1.json"
    out.write_text(json.dumps(blueprint(), indent=2, ensure_ascii=False) + "\n")
    print("wrote", out)
