# Leads back-fill — dry run (2026-11-02)

Read-only Monday GraphQL read of board `2074688480` (Leads): every item's name, group and `board_relation_mm7c1wcw` (Client Profiles) with the linked profile's name and state. Client names are intentionally not recorded here; the per-item list was shown to the requester in the session only.

Rule applied: Lead name = linked Client Profile name, only when exactly one active profile is linked and the names differ (same rule as `9711585`).

| Group | Items | With exactly 1 CP | Already correct | Would be renamed | No CP linked (skipped) |
|---|---|---|---|---|---|
| New Leads (`topics`) | 17 | 17 | 10 | 7 | 0 |
| Qualified (`group_mky7nhp2`) | 11 | 11 | 3 | 8 | 0 |
| Archived (`group_mkzwwy7`) | 49 | 3 | 2 | 1 | 46 |
| **Total** | **77** | **31** | **15** | **16** (15 proposed; 1 excluded, see below) | **46** |

Findings needing a decision before the write:

- Lead `2844833952`: its Client Profile `2844833841` lists the same contact twice, so its name repeats one person. Fix the Client Profile's Contacts first; excluded from the back-fill.
- Two couples have **two Leads each** (pre-2026-09-05 two-applicant Leads from `AUTO-MONDAY-WF-002`): `2741746952` + `2741672373` → profile `2741671494`, and `2855285438` + `2855302791` → profile `2855285077`. Under the rule, both Leads of a couple get the same name.
- 46 archived Leads have no Client Profile linked: unchanged.

Status: dry run only. No Lead was renamed.
