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

## Timing and budget scope follow-up — November 18, 2026

Chrome returned ON_DEVICE drafts that passed schema validation in all 112 completed runs. Manual review used the original case criteria.

| Candidate | Review result | Gate finding |
| --- | --- | --- |
| Timing instructions, 22 targeted runs | 21 pass, 1 revision | E13 and E25 retained the departure and break numbers in both batches. One E25 draft added “as needed” and changed category. |
| [Timing, full suite](quietneeds-timing-full.json) | 24 pass, 5 revisions, 1 fail | E13 and E25 passed. E27 lost the zero-cost condition. |
| [Timing plus free-materials example, full suite](quietneeds-constraints-full.json) | 28 pass, 1 revision, 1 fail | E27 passed. E05 copied the example and replaced the 500 INR materials budget with free handouts. |
| [Timing plus cost rules, full suite](quietneeds-limits-full.json) | 26 pass, 3 revisions, 1 fail | E05 and E27 retained amounts but broadened their scope. E19 dropped the written-instructions request. |

No explicit private markers appeared in the saved drafts. None of the candidates meets promotion criteria. Next compare a shorter instruction set on E05, E19 and E27 with E02, E13 and E25 as controls. Keep mandatory review and manual entry.

## Compact candidate

Two runs each of E02, E05, E13, E19, E25 and E27 passed source/schema (12/12). Semantic review rejected the candidate. It invented additional requirements and surfaced the fictional private family detail in both E13 drafts. One E19 draft omitted written instructions. No full rerun or production promotion followed. The compact candidate can be reproduced with `experiment=compact` in the development evaluator.

After the build migration, the existing two-case system evaluator separately returned expected ON_DEVICE outputs for E18 (clarification only) and E22 (support-person request). This confirmed the evaluator entry point on Rsbuild. It did not test compact prompt acceptance.

## Source-grounded local correction

An experimental second pass received the original synthetic note and a saved incorrect draft. It was instructed to recover each independent accommodation from the note, preserving scope and exact values while removing unsupported and private content. All six responses passed ON_DEVICE source and schema validation. Manual review found one pass, one revision and four failures.

| Case | Observed correction |
| --- | --- |
| E02 | Asked to leave the walking session and still omitted seated participation. |
| E05 | Kept the incorrect free handouts and omitted the 500 INR limit. |
| E13 | Kept the arrival placeholder and added unsupported seating. |
| E19 | Kept the chair and still omitted written instructions. |
| E25 | Corrected the draft to one 10-minute break every hour. |
| E27 | Restored free materials and added a redundant availability request. |

The six incorrect starting drafts came from the saved system (E02), constraints (E05), seated (E13/E25), limits (E19), and timing (E27) batches. The correction pass was rejected and its temporary harness was removed. Before another model promotion attempt, evaluate whether explicit participant confirmation of constraints can prevent unsupported or omitted requirements from being accepted. Manual editing and approval remain in effect.

## Deterministic checks on the local adapter

- Replaying 272 saved drafts with the final checks blocked four previously failed drafts and removed an exact duplicate in one other draft. No draft previously rated as passing was blocked. The rejections were a fabricated free-materials claim, an unresolved arrival placeholder, an omitted explicit break duration, and an event-wide end time substituted for a participant's departure.
- [First live batch](quietneeds-guarded-first-full.json), before the event-wide scope check was added: 30/30 ON_DEVICE and valid schema. Semantic review found 22 pass, 3 revisions, and 5 failures. The newly observed event-wide end time was blocked when replayed after the scope check was added.
- [Final live batch](quietneeds-guarded-final-full.json): 30/30 ON_DEVICE and valid schema. Semantic review found 23 pass, 2 revisions, and 5 failures. No draft in this batch triggered the checks. Some drafts still omit independent requests or alter intent despite preserving a literal time. Neither live batch contained a synthetic private marker.

These checks improve what can reach review when they recognize a failure. They cannot establish intent, detect all omissions or verify confidentiality. QN-014 remains open.
