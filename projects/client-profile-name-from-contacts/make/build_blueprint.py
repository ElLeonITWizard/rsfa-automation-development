"""Generates the candidate blueprint make/blueprints/cp-name-from-contacts.candidate-v1.json for
"M.com: Client Profile Name from Contacts (Nov 2026)". Local only; the hook is the placeholder 0 until created.

Run: python3 make/build_blueprint.py
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
MONDAY_CONN = 240128            # "My Monday v2 connection - 1" (used by 8410524, 9447215, 10083674)
ERROR_SCENARIO = "SCN_8732008"  # Outlook: Email Notification after Failed Scenario
ALERT_TO = "tech@rsfa.co.nz"
CP_BOARD = 5024661649
CONTACTS_COL = "board_relation38"
# Create events wait 60 s before reading: (1) the Leads intake (8800779) finishes linking all contacts (~5 s), and
# (2) Power Automate "SharePoint - Client Folder Creation from Monday.com" has created the folder, so the
# folder-rename flow can find it by pulseID when our rename fires. Measured on 27 CP creations (Sep-Nov 2026):
# folder link written after min 20.6 s, median 29.4 s, max 50.8 s. Requested 90 -> 60 s on 2026-11-03.
CREATE_DELAY_S = 60

CODE = (HERE / "code" / "name-from-contacts.js").read_text()
assert "{" + "{" not in CODE and "}" + "}" not in CODE, "no double curly braces in the Code module source"

PULSE = "{{1.event.pulseId}}"
IS_CREATE = '1.event.type = "create_pulse"'


def gql(mid, label, query, variables, x, y):
    return {"id": mid, "module": "monday:ExecuteGraphQLQueryV2", "version": 2,
            "parameters": {"__IMTCONN__": MONDAY_CONN},
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


def blueprint():
    read = gql(4, "Read Client Profile and Contacts",
               "query { items(ids: [" + PULSE + "]) { id name state board { id } contacts: column_values(ids: [\""
               + CONTACTS_COL + "\"]) { ... on BoardRelationValue { linked_item_ids display_value } } } }", [], 900, 0)
    assert "{{" not in read["mapper"]["queryBody"].replace(PULSE, "")
    read["onerror"] = [notify(9, "Client Profile name from Contacts: reading Client Profile <b>" + PULSE + "</b> failed. "
                              "{{4.error.message}}. Name not changed.", 900, 300), ignore(10, 1200, 300)]

    event_flow = [
        {"id": 3, "module": "util:FunctionSleep", "version": 1, "parameters": {},
         "mapper": {"duration": "{{if(" + IS_CREATE + "; " + str(CREATE_DELAY_S) + "; 1)}}"},
         "filter": {"name": "Client Profile created, or its Contacts changed", "conditions": [
             [{"a": '{{ifempty(1.challenge; "")}}', "b": "", "o": "text:equal"},
              {"a": "{{1.event.boardId}}", "b": str(CP_BOARD), "o": "text:equal"},
              {"a": PULSE, "b": "^[0-9]{1,20}$", "o": "text:pattern"},
              {"a": "{{1.event.type}}", "b": "^(create_pulse|manual_rerun)$", "o": "text:pattern"}],
             [{"a": '{{ifempty(1.challenge; "")}}', "b": "", "o": "text:equal"},
              {"a": "{{1.event.boardId}}", "b": str(CP_BOARD), "o": "text:equal"},
              {"a": PULSE, "b": "^[0-9]{1,20}$", "o": "text:pattern"},
              {"a": "{{1.event.type}}", "b": "update_column_value", "o": "text:equal"},
              {"a": "{{1.event.columnId}}", "b": CONTACTS_COL, "o": "text:equal"}]]},
         "metadata": {"designer": {"x": 600, "y": 0, "name": "Wait 60 s on create (Leads intake + SP folder creation), 1 s otherwise"}}},
        read,
        {"id": 5, "module": "code:ExecuteCode", "version": 1, "parameters": {},
         "mapper": {"language": "javascript", "inputFormat": "editor", "codeEditorJavascript": CODE,
                    "input": [{"name": "profile", "value": "{{4.body.data}}"}, {"name": "eventItemId", "value": PULSE}]},
         "metadata": {"designer": {"x": 1200, "y": 0, "name": "Name from Contacts (name-from-contacts.js)"}},
         "onerror": [notify(11, "Client Profile name from Contacts: planning failed for Client Profile <b>" + PULSE + "</b>. "
                                "{{5.error.message}}. Name not changed.", 1200, 300), ignore(12, 1500, 300)]},
        dict(gql(6, "Rename Client Profile",
                 "mutation ($i: ID!, $v: String!) { change_simple_column_value(board_id: " + str(CP_BOARD)
                 + ", item_id: $i, column_id: \"name\", value: $v) { id } }",
                 [{"key": "i", "value": "{{5.result.itemId}}"}, {"key": "v", "value": "{{5.result.newName}}"}], 1500, 0),
             filter={"name": "Rename needed", "conditions": [[{"a": "{{5.result.action}}", "b": "rename", "o": "text:equal"}]]},
             onerror=[notify(7, "Client Profile name from Contacts: renaming Client Profile <b>" + PULSE + "</b> failed. "
                                "{{6.error.message}}.", 1500, 300), ignore(8, 1800, 300)]),
    ]
    challenge = {"flow": [{
        "id": 13, "module": "gateway:WebhookRespond", "version": 1, "parameters": {},
        "mapper": {"status": 200, "body": '{"challenge":"{{1.challenge}}"}',
                   "headers": [{"key": "Content-Type", "value": "application/json"}]},
        "filter": {"name": "monday.com verification challenge",
                   "conditions": [[{"a": '{{ifempty(1.challenge; "")}}', "b": "", "o": "text:notequal"}]]},
        "metadata": {"designer": {"x": 600, "y": -300}}}]}
    return {
        "name": "M.com: Client Profile Name from Contacts (Nov 2026)",
        "flow": [{"id": 1, "module": "gateway:CustomWebHook", "version": 1, "parameters": {"hook": 0, "maxResults": 1},
                  "mapper": {}, "metadata": {"designer": {"x": 0, "y": 0}, "restore": {"parameters": {"hook": {
                      "data": {"editable": "true"}, "label": "TODO: create at deployment - CP Name from Contacts Webhook"}}}}},
                 {"id": 2, "module": "builtin:BasicRouter", "version": 1, "mapper": None,
                  "metadata": {"designer": {"x": 300, "y": 0}}, "routes": [challenge, {"flow": event_flow}]}],
        # sequential MUST stay False (otherwise Make answers Monday's challenge itself; see the cascade project).
        "metadata": {"instant": True, "version": 1, "designer": {"orphans": []},
                     "scenario": {"roundtrips": 1, "maxErrors": 3, "autoCommit": True, "autoCommitTriggerLast": True,
                                  "sequential": False, "confidential": False, "dataloss": False, "dlq": False,
                                  "freshVariables": False}},
    }


if __name__ == "__main__":
    out = HERE / "blueprints" / "cp-name-from-contacts.candidate-v1.json"
    out.write_text(json.dumps(blueprint(), indent=2, ensure_ascii=False) + "\n")
    print("wrote", out)
