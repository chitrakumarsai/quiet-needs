# Actual device evaluation — November 15, 2026

Firebase 12.19.0; Chrome desktop 157 (browser request headers); 30 fictional cases using ONLY_ON_DEVICE and responseConstraint. Each successful row passed the SDK source check and parser. See quietneeds-synthetic-results.json for exact outputs and individual review notes.

- Source/schema: 30/30.
- Semantic review: 20 pass, 6 need revision, 4 fail, using agent manual review against the case criteria. This is not independent participant evaluation.
- No private canary literals or private reasons observed in the three explicit name/diagnosis/family outputs. Limited synthetic evidence, not an anonymity guarantee.
- Failures: useless clarification (E10), no-request becomes a requirement (E17), vague invented support (E18), lost conditional alternative/duplication (E28).
- Revisions: event-wide schedule change (E03), category mistakes (E09/E20/E21), ambiguous negation (E26), unnecessary clarification (E29).

Keep these failures visible. Do not mark extraction quality accepted based on valid JSON. Next bounded experiment: improve empty/clarification-only/conditional examples and category definitions, then rerun all 30. Mandatory human review remains part of sharing.


## Second actual run

See quietneeds-synthetic-results-r2.json. Source/schema 30/30. Agent semantic review: 28 pass, 1 needs revision (E10 uncertainty omitted), 1 fail (E18 clarification exported as a requirement). Earlier category/empty/conditional failures improved. No private canary literals observed. Prompt revised again for explicit uncertainty and clarification-only output; third run pending.


## Third actual run

See quietneeds-synthetic-results-r3.json. Source/schema 30/30. Agent semantic review: 27 pass, 1 needs revision (E16 category), 2 fail (E18 vague exportable request; E22 duplicate request asserts a support person will attend). Uncertainty preserved in E10. No private canary literals observed. These are measured synthetic results, not statistical guarantees.

Three prompt iterations are enough to show the current limit: semantic correctness is not assured by response constraints or longer examples. Keep the privacy/data boundary and manual review mandatory. Next bounded experiment should use an isolated prompt/system-message comparison on E18/E22 before any full rerun; retain all prior outputs. Extraction quality gate is still open.


## System-message experiment (development only)

Targeted E18/E22: 2/2 source/schema and semantic passes, saved quietneeds-system-targeted.json. Full 30-case system run: 30/30 source/schema, agent review 27 pass / 2 revisions / 1 fail (quietneeds-system-full.json). E18/E22 improve, but E02 loses seated-participation intent and E05/E30 broaden scope. Not promoted into the participant adapter. Keep current adapter and mandatory review while QN-014 remains open. Total saved actual extractions: 122; these are small iterative synthetic tests, not independent statistical evaluation.
