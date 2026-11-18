# Synthetic extraction evaluation

Thirty fictional cases for P1-T07. These are inputs and review criteria, not model results. Run each through the real device adapter; record actual source, schema validity, invented critical details, private-reason leakage and clarification usefulness. Human review remains mandatory. Do not replace these cases with participant data.

Existing observed runs are in TEST_PLAN.md. No aggregate score is claimed until all cases have actual results.


Run the development evaluator at /evaluation.html. System-message comparison: /evaluation.html?experiment=system (E18/E22) or add &scope=all for all 30. This tool is excluded from the production build. Saved results contain only repository-owned fictional cases. See RESULTS.md for actual outcomes; never treat source/schema passes as semantic acceptance.

For the participation and scope comparison, use `/evaluation.html?experiment=system&scope=target` for the baseline and `/evaluation.html?experiment=scope` for the candidate. Both default to E02, E05, E18, E22 and E30 in this comparison.

The seated and attendance example candidate runs E02, E05, E18, E22, E26, E28 and E30 twice at `/evaluation.html?experiment=seated`. Add `&scope=all` to run all 30 once.

Use `experiment=timing` for the departure and break-duration instructions. `experiment=constraints` adds a free-materials example and `experiment=limits` uses cost rules without that example. Each accepts `&scope=all` for the full suite.

Use `experiment=compact` to reproduce the rejected short prompt. It defaults to two passes over E02, E05, E13, E19, E25 and E27.

Use `experiment=explicit` for all 30 cases with direct local rules on fully recognized notes and the production model adapter for the remaining notes. Use `experiment=explicit-constraints` for the same rules with the constraints system prompt and production draft checks on the model path. Saved rows distinguish `LOCAL_RULES` from verified `ON_DEVICE` inference. The first two saved runs predate the direct sensory rules.
