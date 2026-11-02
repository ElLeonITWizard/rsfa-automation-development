"""Builds the two Monday GraphQL queries used by the candidate rename-cascade scenario.

The related-assets query is generated (not hand-written) so every alias matches SPECS in
make/code/rename-planner.js. Placeholders, filled by Make at runtime:
  __PROFILE_ID__   Client Profile item ID (digits only; the scenario filter enforces this)
  __CONTACT_IDS__  comma-separated Contact IDs of the profile, or 0 when it has none

Run: python3 make/queries/build_queries.py   (writes the .graphql files next to this script)
"""
from pathlib import Path

LIMIT = 500  # items_page maximum; a non-null cursor is reported as `truncated` by the planner

REL = "... on BoardRelationValue { linked_item_ids }"
REL_NAMES = "... on BoardRelationValue { linked_item_ids linked_items { id name } }"


def alias(name, board, filter_col, by, fields):
    value = "__PROFILE_ID__" if by == "profile" else "__CONTACT_IDS__"
    return (
        f"  {name}: boards(ids: [{board}]) {{ items_page(limit: {LIMIT}, query_params: {{rules: "
        f"[{{column_id: \"{filter_col}\", compare_value: [{value}], operator: any_of}}]}}) "
        f"{{ cursor items {{ id name state {fields} }} }} }}"
    )


def link(col, names=False):
    return f'link: column_values(ids: ["{col}"]) {{ {REL_NAMES if names else REL} }}'


def people(col, names=False):
    if names:
        return f'people: column_values(ids: ["{col}"]) {{ {REL_NAMES} }}'
    return f'people: column_values(ids: ["{col}"]) {{ ... on BoardRelationValue {{ linked_item_ids display_value }} }}'


def text(name, col):
    return f'{name}: column_values(ids: ["{col}"]) {{ text }}'


# Excluded on 2026-11-02 at RSFA request: 💲Mortgage Pipeline (5025201889) and 📈 KiwiSaver Pipeline
# (5025201954) are boards still in progress (items without Borrowers / Client Profiles, unusual names).
ALIASES = [
    # rule cp — link column must hold exactly this profile
    alias("leads", 2074688480, "board_relation_mm7c1wcw", "profile", link("board_relation_mm7c1wcw")),
    alias("mortgageApp", 5025483251, "board_relation_mm6fr9y4", "profile", link("board_relation_mm6fr9y4")),
    alias("sopMasterboard", 5026186805, "board_relation_mm8fc6yd", "profile", link("board_relation_mm8fc6yd")),
    alias("existingKiwisaver", 5024672484, "board_relation_mktzw3h0", "profile", link("board_relation_mktzw3h0")),
    # rule borrowers — found through the Client Profiles column, named from Borrowers
    alias("existingMortgages", 5024672364, "connect_boards7", "profile", people("board_relation_mkyjjs0w")),
    # rule owners — found through the Client Profiles column or a Policy Owner contact
    alias("insurancePipelineByProfile", 5025201920, "board_relation_mkxpqnck", "profile",
          people("board_relation_mkyjddgg", True) + " " + text("provider", "color_mkxpxs6j")),
    alias("insurancePipelineByOwner", 5025201920, "board_relation_mkyjddgg", "contacts",
          people("board_relation_mkyjddgg", True) + " " + text("provider", "color_mkxpxs6j")),
    alias("existingInsuranceByProfile", 5024672437, "board_relation_mkyhtdhk", "profile",
          people("board_relation_mkyjvgra", True) + " " + text("provider", "label9")),
    alias("existingInsuranceByOwner", 5024672437, "board_relation_mkyjvgra", "contacts",
          people("board_relation_mkyjvgra", True) + " " + text("provider", "label9")),
    # rule contact — single linked Contact of this profile
    alias("insuranceQuestionnaire", 5025365501, "board_relation_mktbzvj0", "contacts", link("board_relation_mktbzvj0", True)),
    alias("kiwisaverQuestionnaire", 5026459551, "board_relation_mm09dn6v", "contacts", link("board_relation_mm09dn6v", True)),
    alias("aircall", 5026308494, "board_relation_mm0pghp5", "contacts",
          link("board_relation_mm0pghp5", True) + " " + text("contactStatus", "color_mm7hf0xh")),
]

PROFILE_QUERY = (
    "query ($ids: [ID!]) { items(ids: $ids) { id name state board { id } "
    f'contacts: column_values(ids: ["board_relation38"]) {{ {REL} }} }} }}'
)

ASSETS_QUERY = "query {\n" + "\n".join(ALIASES) + "\n}"

if __name__ == "__main__":
    here = Path(__file__).parent
    (here / "client-profile.graphql").write_text(PROFILE_QUERY + "\n")
    (here / "related-assets.graphql").write_text(ASSETS_QUERY + "\n")
    print(f"{len(ALIASES)} aliases written")
