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

## Targeted participation and scope comparison — November 18, 2026

Chrome desktop, locked Firebase 12.19.0. The evaluator ran one matched five-case batch per variant. Both had 5/5 source/schema passes and all returned empty question arrays except E18. Draft text below is transcribed from the evaluator.

| Case | Existing system prompt | Participation and scope instruction |
| --- | --- | --- |
| E02 | **Fail**, participation: “Please consider minimizing standing during the walking session.” | **Fail**, participation: “Please provide assistance with standing during the walking session, if needed.” Both miss a seated way to participate. |
| E05 | **Fail**, cost: “Please confirm the cost associated with this event.” Drops the materials limit and currency. | **Revision**, cost: “Please respect my materials budget of 500 INR.” Other: “Please ensure that any costs associated with materials do not exceed 500 INR.” Preserves the limit and scope, with a duplicate request. |
| E18 | **Pass**, no requests. “What part of the event might be difficult to take part in?” | **Pass**, same result. |
| E22 | **Pass**, participation: “Please allow for a support person to attend.” | **Pass**, participation: “Please allow me to bring a support person to the event.” |
| E30 | **Fail**, timing: “Please start the event before 12 pm.” Drops the start of the personal window and changes the event schedule. | **Pass**, timing: “Please allow me to attend between 10 am and noon.” |

The baseline differed from its earlier 30-case outputs. One matched batch cannot establish repeatability or attribute the improvement solely to the changed instruction. The candidate still misses the participation constraint. Keep it development-only and defer the full suite. Next experiment: compare a single explicit seated-alternative example across repeated runs of E02 and the existing negation and conditional cases before rerunning all 30.

## Seated and attendance examples — November 18, 2026

- **First targeted variant:** two runs each of E02, E05, E18, E22, E26, E28 and E30. All 14 passed source/schema. The seated example and single-expense instruction preserved seated participation and avoided a second materials-budget request in both replications. E30 broadened personal attendance in both runs. E26 produced one placeholder clarification.
- **Revised targeted variant:** a personal attendance example and a direct instruction for clarification questions corrected those failures in both replications. All 14 passed source/schema and the case criteria in this manual review.
- **Full revised variant:** 30/30 source/schema and 26 pass / 2 revisions / 2 failures in manual review. E02, E05 and E30 passed. E13 added a start placeholder to a departure-only note. E25 omitted the 10-minute duration and repeated the break request. E12 and E29 contain unneeded clarification or scope. No private canary literals or private reasons appeared in the recorded outputs. All 30 drafts and the review are in [quietneeds-seated-full.json](quietneeds-seated-full.json).

Keep the candidate development-only. The next comparison should cover departure without arrival, exact break duration and interval, and the passing attendance-window and uncertainty cases.
