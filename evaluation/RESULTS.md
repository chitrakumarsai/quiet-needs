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

## Participant-assisted recovery

The participant flow recovered the written-instructions request that whole-note E19 drafts missed. In a synthetic reproduction, the participant kept an edited aisle-chair request and selected only “Please send written instructions.” The production adapter returned an ON_DEVICE result, “Please provide written instructions.” The card added that request, cleared prior approval, and displayed both exportable requests after reapproval. The private marker elsewhere in the note was absent from the approved JSON.

A second synthetic note supplied a personal departure and a materials budget. Separately selecting the two sentences added “Please allow me to depart by 4 pm.” and “Please be aware that my materials budget is 500 INR.” The time and budget scope were retained. The departure phrasing changed from “at” to “by,” so participant review still matters.

These checks cover three selected-text extractions. The initial chair request was entered manually. Whole-note extraction quality remains open under QN-014.

## Explicit requests with the current model fallback

[Thirty-case Chrome run](quietneeds-explicit-full.json) with a development-only whole-note recognizer ahead of the production model adapter. The recognizer handled eight cases, all semantic passes. The other 22 went to the verified on-device model. The adapter produced 21 validated drafts and withheld one for failing a local check. Across both paths, manual review found 26 passes, one revision and three failures. All five failures in the previous full run passed in this run. No private canary or private reason appeared in the outputs.

The model changed a personal departure into an event-wide end time (E13), invented a broad request on a clarification-only note (E18), and produced no usable draft for an attendance window (E30). The stepping-out request (E29) had an extra scheduling preference and a placeholder question. Additional automated examples cover unfamiliar, private and conditional notes that should go to the existing model path.

[Second thirty-case Chrome run](quietneeds-explicit-constraints-full.json) kept the same local rules and switched the remaining 22 cases to the earlier constraints system prompt with production draft checks. All 30 drafts passed schema validation. Manual review found 27 passes, two revisions and one failure. E13, E18 and E30 passed. The model weakened “avoid flashing lights” to “minimize flashing lights” (E07), missed the break in E16, and added a scheduling preference in E29. No private canary or private reason appeared in the outputs. Both candidates remain development-only.

The production schedule-scope check now blocks the observed “end this event” phrasing when the source asks only for personal departure. A test verifies that the same wording remains valid when the participant explicitly asks to change the event schedule.

[Third thirty-case Chrome run](quietneeds-explicit-sensory-full.json) used the constraints fallback after the addition of direct sensory rules. Manual review found 29 passes and one revision. All nine direct rule drafts preserved the case criteria, including “avoid flashing lights,” and all 21 verified ON_DEVICE drafts passed schema. The model kept the quiet-break request in this run and again added an unsupported scheduling preference to E29. Held-out unit examples verified avoiding strobe lights, a quiet break paired with a seat, and abstention on conditional and mixed notes. The full candidate remains in development pending evidence that the fallback preserves participant scope consistently.

## Stepping out and scheduled breaks

Three Chrome runs each covered the original 30 cases plus four mixed notes. All 102 drafts passed schema. No synthetic private marker or reason appeared in the drafts. Manual review checked whether each request retained its own scope and qualifiers.

| Candidate | Pass / revision / fail | Finding |
| --- | --- | --- |
| [Scheduling instruction](quietneeds-step-out-full.json) | 28 / 2 / 4 | Removed the added scheduling preference in E29. Dropped the explicit opt-out in E26 and H02. H03 and H04 also lost independent requests. |
| [Paired examples](quietneeds-step-out-paired-full.json) | 30 / 2 / 2 | E29 passed. E26 and H02 still lost the opt-out. H04 passed in this run. |
| [Paired examples and complete-clause recognition](quietneeds-step-out-clauses-full.json) | 29 / 3 / 2 | All 12 rule drafts passed, including E26, H01 and H02. E29 passed via the model. The model invented support-person seating in E22 and omitted stepping out in H04. |

The recognizer checks every clause before using its result. When a clause is unfamiliar, the full note goes to the existing on-device fallback in the evaluator. Held-out unit examples cover mixed positive and negative requests and verify abstention on conditional and unknown clauses. The participant adapter stays on its verified production path. QN-014 is open because the latest candidate still loses or adds requests in model-generated drafts.

## Two-pass coverage against source text

Each Chrome run used the original 34 cases and four new mixed notes. Both passes require verified `ON_DEVICE` responses. The evaluator checks the draft count, timings and costs against the selected source. It saves counts and drafts without separate evidence text. All 12 rule drafts passed in each run.

| Candidate | Pass / revision / fail | Finding |
| --- | --- | --- |
| [Initial array constraint](quietneeds-coverage-initial-full.json) | 12 / 0 / 26 | No usable evidence response on the model path. |
| [Verbatim quotations in an object](quietneeds-coverage-full.json) | 30 / 1 / 7 | Seven drafts withheld. Evidence for all four new cases failed validation. The model also found no passage for the departure request in E13. |
| [Numbered passages](quietneeds-coverage-ids-full.json) | 26 / 3 / 9 | Seven drafts withheld. Two new cases produced drafts, but C01 lost a condition and C02 omitted two of three requests. |

Neither candidate passed any of the four new mixed cases. The identifiers reduced quoting failures, but a count match can still leave an entire request unrepresented when the first pass skips it. No private marker or private reason appeared in the saved drafts. The production participant path stays on the previous adapter. A future coverage experiment should test whether participants can confirm the source passages before the model drafts from them.

## Participant-confirmed passages

In Chrome, an evaluator selected nine exact passages across the four mixed fictional notes. The existing device-only adapter verified the source for every draft. Each passage produced one request. Two notes passed manual review.

| Case | Result | Observed behavior |
| --- | --- | --- |
| QN-C01 | Pass | Preserved the upstairs condition on the ground-floor option and kept the advance reference sheet unconditional. |
| QN-C02 | Pass | Preserved the personal 2:30 pm departure, advertised end time, and support-person permission. |
| QN-C03 | Fail | Preserved live captions, but changed borrowing a kit above 20 USD into requiring the kit to cost less than 20 USD. The private marker was absent from the draft. |
| QN-C04 | Fail | Preserved the music request and omitted seating, but replaced moving to the hallway when things get loud with providing a quieter area when the event is excessively loud. |

Editing a confirmed selection disabled drafting and removed its prior result from review. This was an evaluator walkthrough using fictional notes. Participant usability and general extraction accuracy remain unverified. The extraction-quality gate stays open.

## Preserving the action in confirmed passages

Chrome drafted all 13 confirmed passages on device. Manual review found three passes, two revisions, and one failure across six fictional notes.

| Case | Result | Finding |
| --- | --- | --- |
| QN-C01 | Pass | Preserved the upstairs condition and the unconditional reference sheet. |
| QN-C02 | Revision | Kept the departure time and support person. Changed ending at the advertised time to ending by that time. |
| QN-C03 | Fail | Kept the threshold above 20 USD and the caption request. Changed borrowing a kit to providing one. |
| QN-C04 | Revision | Kept the hallway and the scoped music request. Changed the hallway trigger from loud to too loud. |
| QN-D01 | Pass | Kept bringing a personal headset if the rental exceeds 15 GBP, alongside the separate advance timetable. |
| QN-D02 | Pass | Kept finishing the exercise in the courtyard if rehearsal gets too loud and preserved the written instructions. |

The guidance improved three details observed in the baseline and introduced a timing regression. QN-014 remains open. Participant usability was outside this evaluator walkthrough.

## Checking confirmed passages for wording drift

The development evaluator flags known changes to borrowing, bringing a personal item, exact scheduled end times, hallway destinations, and plain noise conditions. When a check flags a passage, the evaluator keeps the draft visible beside its source and withholds the combined card from the result file.

Chrome reproduced the borrowing substitution in QN-C03 and withheld the combined draft. The first QN-D01 run exposed a new error where the model asked to increase a rental fee instead of allowing a personal headset. The check now flags that exact observed output in offline replay and accepts the faithful wording from CP-029. Regression tests also cover both previously observed hallway changes and the shift from ending at the advertised time to ending by it. These are narrow wording checks. General semantic equivalence and false positive rates remain unverified.

The live headset retry preserved the headset request and added a second unsupported request to calculate the rental fee. The check now requires one request per confirmed passage. Replay rejects the combined headset output and accepts the faithful single request. The final count check was verified in replay.

## Unfamiliar wording controls

The check was held fixed for four fresh fictional notes. The offline replay used one faithful paraphrase and one intentionally altered draft for the first passage of each note.

| Case | Faithful paraphrase | Altered draft |
| --- | --- | --- |
| QN-F01 | Flagged “lend me a pencil” under the original condition | Accepted borrowing when markers are available |
| QN-F02 | Flagged “finish the practice at the published time” | Accepted ending at the published time or earlier |
| QN-F03 | Flagged hallway access “when the discussion is loud” | Accepted hallway access for noise or a warm room |
| QN-F04 | Accepted use of a loan headset above the specified fee | Accepted increasing the rental fee |

The replay flagged three of four faithful paraphrases and missed all four intentional changes. These are counts for the selected controls.

Chrome generated eight requests from the eight confirmed passages. Manual review of the four combined cards found one pass, one correctly withheld draft, and two accepted drafts with meaning changes. QN-F02 kept the exact end time and the instructions. QN-F03 was correctly withheld after it changed hallway access to generic permission to step out. QN-F01 passed the check after losing the fact that the venue had run out of markers. QN-F04 passed the check after turning permission to use a loan headset into a request to consider one. The wording check remains in development.

## Participant review exercise

A scripted Chrome walkthrough verified the side-by-side source and draft display, rejection of a blank approval, focus moving to the next card, editing and approving a correction, accepting the faithful control, adding an omitted request, skipping a card, and downloading the results. The downloaded JSON contained the three expected approval snapshots and one skip, with a time and optional friction field for each card. The evaluator knew the intended corrections. Independent participant sessions and manual scoring are pending.

The standalone participant copy also opened from disk in Chrome, ran all four cards, and downloaded a valid four-record JSON file. That run verified packaging only. Independent reviews remain pending.

### First participant return

One participant approved all four cards and skipped none. They corrected one of four seeded issues, left three in the approved text, and introduced no new issues. The faithful control was approved as prepared.

| Card | Outcome | Time |
| --- | --- | ---: |
| QN-R01 | Missed the hallway destination. The draft still gave generic permission to step out. | 5 s |
| QN-R02 | Approved the faithful control as prepared. | 3 s |
| QN-R03 | Restored live discussion captions. Missed the substitution of a price limit for conditional borrowing. Reported difficulty understanding the passage. | 27 s |
| QN-R04 | Approved the unsupported seating request along with the intended support-person and end-time requests. | 7 s |

Recorded card time totaled 42 seconds. The export did not record whether the facilitator provided help. This single return shows that the review exercise can surface omissions and that approval can still carry changes in meaning. QN-014 remains open. Collect the remaining pilot reviews with the same exercise before changing the review design.

### Second participant return

The second participant also approved all four cards and skipped none. They restored live discussion captions and approved the same three remaining errors as the first participant. They left the faithful control unchanged and introduced no new issues. Recorded card time totaled 48 seconds, with 24 seconds on the hallway card. They selected no friction option. The export does not indicate whether the facilitator provided help.

Across the two participants, both corrected the missing captions, and both missed the hallway destination, the change from conditional borrowing to a price limit, and the unsupported seating request. That is two corrections and six missed errors across eight opportunities. Both faithful controls passed. One planned review remains before comparing the full pilot and changing the review design.

### Three-participant pilot results

The third participant approved all four cards, restored live discussion captions, and left the same three errors as the first two participants. The faithful control stayed unchanged. The kit passage was marked difficult to understand. Recorded card time totaled 24 seconds, including 16 seconds on the kit card.

| Seeded issue | Corrected | Still present in approved text |
| --- | ---: | ---: |
| Missing hallway destination | 0 of 3 | 3 of 3 |
| Conditional borrowing changed to a price limit | 0 of 3 | 3 of 3 |
| Missing live discussion captions | 3 of 3 | 0 of 3 |
| Unsupported seat for the support person | 0 of 3 | 3 of 3 |
| **Total** | **3 of 12** | **9 of 12** |

All 12 cards were approved and none were skipped. All three faithful controls passed and reviewers introduced no new errors. Two participants reported difficulty understanding the kit passage. The exports do not establish whether anyone received facilitation help.

In these fictional cases, showing the source beside the draft helped reviewers catch the missing captions. All three repeatedly approved a missing destination, a changed action and condition, and an extra request. QN-014 remains open. The next review design should prompt reviewers to check each requested action, any condition or location, and whether each proposed request appears in the source. Evaluate the design with fresh reviewers and fictional cases.

### Guided comparison walkthrough

Chrome opened both standalone variants from local files. The guided form rejected an unchecked approval, focused the first incomplete check, cleared all checks when the draft changed, and advanced after confirmation. Both variants completed the same four cases and downloaded four records with their distinct variant labels. This walkthrough verified the workflow. Fresh participant returns are pending.

### First guided and unguided returns

One export from each variant completed all four matched cards. Both reviewers corrected two of four seeded issues and approved the same two remaining errors. Neither skipped a card or introduced a new issue. The faithful control passed in both.

| Card | Outcome in both variants |
| --- | --- |
| QN-G01 | Missed the main entrance. The draft kept the crowding condition and advance schedule request. |
| QN-G02 | Approved the faithful control as prepared. |
| QN-G03 | Restored the shared copy above £15 and added large-print handouts. Both requests were entered on one line. Both were counted as semantic corrections. |
| QN-G04 | Approved the unsupported parking request alongside interpreter permission and the published end time. |

The guided export recorded 258 seconds across the four cards and reported difficulty understanding QN-G03. The unguided export recorded 84 seconds and reported difficulty deciding whether to approve QN-G03. These are individual elapsed times. The exports provide no measure of interruptions or facilitator assistance. This pair shows no observed accuracy gain. It is too small to estimate the effect on accuracy or time.

### Second guided and unguided returns

The two additional returns had the same semantic outcome as the first pair. Each corrected the shared-workbook request above £15 and restored large-print handouts. Each left the main entrance missing and retained the unsupported parking request. The faithful controls passed. Neither return contained a skip or a new error.

| Variant | Returns | Seeded issues corrected | Seeded issues missed | Recorded card time per return |
| --- | ---: | ---: | ---: | --- |
| Guided | 2 | 4 of 8 | 4 of 8 | 258 s, 69 s |
| Unguided | 2 | 4 of 8 | 4 of 8 | 84 s, 28 s |

All four returns reported friction on the shared-workbook card. The new guided return reported difficulty comparing the draft with the source, and the new unguided return reported difficulty deciding whether to approve. One planned return per variant remains. Individual recorded times do not establish a timing effect.

### Completed guided and unguided comparison

The final pair had the same semantic result as the first four returns. All 24 cards were approved. Across all six reviewers, everyone restored the conditional shared-workbook request and large-print handouts. Everyone missed the main entrance and kept the unsupported parking request. All six faithful controls passed, and reviewers introduced no new errors.

| Variant | Returns | Seeded issues corrected | Seeded issues missed | Recorded card time per return |
| --- | ---: | ---: | ---: | --- |
| Guided | 3 | 6 of 12 | 6 of 12 | 258 s, 69 s, 41 s |
| Unguided | 3 | 6 of 12 | 6 of 12 | 84 s, 28 s, 12 s |

All six reviewers reported difficulty on the workbook card. The final pair both selected deciding whether to approve. The guided prompts showed no accuracy gain on these four fictional cards. The sample is small and the exports do not record interruptions or facilitator assistance. QN-014 remains open. The next prototype will let reviewers compare each request with its source and check for missing requests before approving a draft.

### Request-by-request prototype walkthrough

Chrome opened both offline copies and completed the four fresh fictional cases. The request-by-request version rejected an unconfirmed draft and an empty request. Editing cleared the edited request confirmation and the check for missing actions. An unchanged request retained its confirmation. The walkthrough added captions, removed an unsupported meal request, and verified the approved text in the downloaded JSON. The unguided comparison showed the same cases and reached the download screen. Participant comparison results are pending.

### First request-by-request and matched comparison returns

The request-by-request export and the supplied comparison each approved all four cards. Each corrected two of four seeded issues. Both restored bringing personal headphones if the rental exceeds £12 and added video captions. Both approved a generic waiting location in place of the reception desk and kept the unsupported meal request. Both faithful controls passed. Neither return contained a skip or a new semantic error.

| Variant | Seeded issues corrected | Seeded issues missed | Recorded card time |
| --- | ---: | ---: | ---: |
| Request-by-request | 2 of 4 | 2 of 4 | 160 s |
| Unguided comparison | 2 of 4 | 2 of 4 | 59 s |

Both reported difficulty comparing the source and draft on QN-J03. The comparison recorded the two corrections on one line. The request-by-request version recorded them on separate lines. Both received the same semantic score. The pasted comparison matched the local comparison export and was counted once. There is no observed accuracy gain in this first pair. The two individual times cannot establish the time cost of the workflow.

### Completed request-by-request comparison

Validated six distinct exports, three per variant. All 24 cards were approved, all six faithful controls passed, and no reviews recorded a skip or newly introduced semantic error.

| Seeded issue | Request-by-request corrected | Unguided corrected |
| --- | ---: | ---: |
| Reception desk replaced with a generic quiet area | 0 of 3 | 0 of 3 |
| Conditional permission to bring personal headphones replaced with a rental price limit | 3 of 3 | 3 of 3 |
| Video captions omitted | 3 of 3 | 3 of 3 |
| Unsupported meal for the support person | 2 of 3 | 2 of 3 |
| **Total** | **8 of 12** | **8 of 12** |

Recorded card times were 160, 76, and 50 seconds for request-by-request review and 59, 28, and 28 seconds for unguided review. The medians were 76 and 28 seconds respectively. All six exports reported difficulty comparing source and draft on the headphones card. The four reviewers who removed the meal each reported editing friction on that card. The small sample and lack of interruption or facilitation data limit interpretation of time and usability.

The extra confirmations produced no observed correction gain. The location remained wrong in all six approved drafts even when reviewers confirmed each request. QN-014 stays open. Change the next experiment to collect the requested action and any condition, place, time, or amount from the participant before they see a proposed draft. Keep the confirmed text visible when reviewing the final card. Test it on fresh notes with a location change and an unsupported addition.

### Participant-authored prototype walkthrough

Chrome opened both standalone copies. The authored version rejected an empty action, previewed two written requests and their details, reopened editing, and approved the refreshed preview. The downloaded record preserved the revised location and both detail lines verbatim, with three explicit skips in the walkthrough. The comparison showed the same fictional cases with prepared drafts and reached its download screen. Participant evidence is pending.

### Participant-authored returns

Scored three authored returns. The pasted result matched a file in Downloads, so it was counted once. The other two exports were in the temp folder. All 12 cards passed the semantic criteria. Every return preserved the coat-rack location and crowding condition, the personal 3:15 pm departure, the personal-supplies condition above £18, the transcript, and the requested event details. No unsupported travel pass appeared. No card was skipped.

The three exports contained identical approved wording, with different times and friction entries. This confirms three distinct submitted records. Independence of the responses cannot be verified from the files. Several details were repeated between the action and detail fields without changing meaning. Recorded card times totaled 390, 108, and 133 seconds. One return reported editing friction on the location card. The matched prepared-draft returns are pending.

### Completed participant-authored comparison

All three prepared-draft returns passed all four cases. Each restored the coat-rack location, restored conditional permission to bring personal supplies and the transcript request, and removed the unsupported travel pass. Each left the faithful control unchanged. The three prepared-draft exports had identical approved wording within their variant, with distinct elapsed times. As with the authored returns, the files cannot establish independence.

| Variant | Cards passed | Skips | Unsupported requests retained | Recorded card time per return |
| --- | ---: | ---: | ---: | --- |
| Participant-authored | 12 of 12 | 0 | 0 | 390 s, 108 s, 133 s |
| Prepared-draft comparison | 12 of 12 | 0 | 0 | 174 s, 56 s, 33 s |

All three prepared-draft returns reported comparison friction on each of the three cards with seeded issues. One authored return reported editing friction on the location card. The timings were longer for the authored returns in this sample. The small sample, identical wording within each variant, and unrecorded assistance limit interpretation. The experiment shows no observed accuracy gain for authorship on these cases. The earlier extraction and review failures still leave QN-014 open.
