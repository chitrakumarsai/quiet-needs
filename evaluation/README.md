# Synthetic extraction evaluation

Thirty fictional cases for P1-T07. These are inputs and review criteria, not model results. Run each through the real device adapter; record actual source, schema validity, invented critical details, private-reason leakage and clarification usefulness. Human review remains mandatory. Do not replace these cases with participant data.

Existing observed runs are in TEST_PLAN.md. No aggregate score is claimed until all cases have actual results.


Run the development evaluator at /evaluation.html. System-message comparison: /evaluation.html?experiment=system (E18/E22) or add &scope=all for all 30. This tool is excluded from the production build. Saved results contain only repository-owned fictional cases. See RESULTS.md for actual outcomes; never treat source/schema passes as semantic acceptance.

For the participation and scope comparison, use `/evaluation.html?experiment=system&scope=target` for the baseline and `/evaluation.html?experiment=scope` for the candidate. Both default to E02, E05, E18, E22 and E30 in this comparison.

The seated and attendance example candidate runs E02, E05, E18, E22, E26, E28 and E30 twice at `/evaluation.html?experiment=seated`. Add `&scope=all` to run all 30 once.

Use `experiment=timing` for the departure and break-duration instructions. `experiment=constraints` adds a free-materials example and `experiment=limits` uses cost rules without that example. Each accepts `&scope=all` for the full suite.

Use `experiment=compact` to reproduce the rejected short prompt. It defaults to two passes over E02, E05, E13, E19, E25 and E27.

Use `experiment=explicit` for all 30 cases with direct local rules on fully recognized notes and the production model adapter for the remaining notes. Use `experiment=explicit-constraints` for the same rules with the constraints system prompt and production draft checks on the model path. Saved rows distinguish `LOCAL_RULES` from verified `ON_DEVICE` inference. The first two saved runs predate the direct sensory rules.

Use `experiment=step-out` to run the original 30 and four mixed-note cases. Add `&examples=paired` for the prompt used in the latest run. The first two stepping-out runs predate the rule that combines fully recognized clauses.

Use `experiment=coverage` to run all 38 cases, including four new mixed notes. For notes the local rules cannot cover, the first on-device call identifies verbatim evidence. Use `experiment=coverage-ids` to identify numbered passages instead. A second on-device call drafts one request per identified passage, in order. The evaluator checks the count, numeric details and existing scope rules. The export records how many passages were identified, along with the draft or a fixed error. It omits the source passages and model evidence as separate fields.

Use `experiment=confirmed-selection` to review the four mixed notes and confirm exact passages before drafting. Paste one passage per line and include any conditions that apply. The evaluator displays each on-device result beside its source passage. Editing the selected passages clears confirmation and drops the previous result for that note. The results file contains the combined synthetic drafts and passage counts.

Add `&variant=preserve-action` to compare guidance about preserving the action, destination and condition. The variant includes QN-D01 and QN-D02 as fresh mixed-note controls.

Use `&variant=check-action` to run the same wording variant with checks for the observed borrowing, event end time, and hallway changes. A flagged passage stays visible for review, and the results file records that the combined draft was withheld.

Add `&scope=fresh` to `variant=check-action` to load the four independent phrasing controls, QN-F01 through QN-F04.

## Facilitating the review exercise

Open `/evaluation.html?experiment=participant-review` on the development server. Use reviewers who have not seen the scoring criteria. Give them the page instructions and let them work through all four fictional cards without hints. If they ask for help, note the point of confusion and any help given. Use a new tab for each review and download the result after completion. Keep review records outside Git. Ask reviewers to use only the fictional material and leave identifying information out of the exercise.

After the session, compare the approved requests to the following criteria. Accept equivalent wording. Record corrected errors, missed errors, changes introduced during review, skips, requests for help, and reported friction. Record elapsed time as descriptive information.

| Card | Facilitator scoring criteria |
| --- | --- |
| QN-R01 | Restore the hallway destination and preserve the noise condition. Keep the advance room number request. |
| QN-R02 | Keep advance warm-up instructions and the 2:30 pm personal departure. This is the faithful control. |
| QN-R03 | Restore borrowing the kit only above 20 USD and add the omitted request for live discussion captions. |
| QN-R04 | Remove unsupported seating. Keep support-person permission and the advertised workshop end time. |

The JSON records card IDs, approved requests or skips, elapsed seconds, and an optional fixed friction choice. The facilitator scores meaning after the session. Report counts with the number of independent reviewers and avoid treating the scripted walkthrough as participant evidence.

## Comparing guided and unguided review

Use `/evaluation.html?experiment=guided-review` for the guided exercise and `/evaluation.html?experiment=participant-review&set=fresh` for the unguided comparison. Both use the same four new fictional cards. The downloaded JSON identifies the variant. Give each fresh reviewer only one variant, alternate assignments, and use the same introduction and assistance rules for both groups. Record corrections, missed issues, new mistakes, skips, friction, and time by variant. Keep the returned exports outside Git.

| Card | Facilitator scoring criteria |
| --- | --- |
| QN-G01 | Restore waiting by the main entrance if the hall gets crowded. Keep advance schedule delivery. |
| QN-G02 | Keep advance instructions and the step-free route to the demonstration room. This is the faithful control. |
| QN-G03 | Restore the shared workbook copy if the price exceeds 15 GBP and add large-print handouts. |
| QN-G04 | Remove the unsupported parking request. Keep interpreter permission and the published end time. |

Suggested invitation: “Please open the attached HTML file in Chrome and review the four fictional cards. Follow the instructions in the exercise. When finished, download the results and send back the JSON. Use only the fictional information provided.”

## Comparing request-by-request review

Use `/evaluation.html?experiment=request-review` for request-by-request review and `/evaluation.html?experiment=request-comparison` for the original approval flow with the same four fictional cards. Reviewers receive one version each. Alternate assignments among fresh reviewers and keep the introduction and assistance rules consistent. Score semantic corrections, remaining errors, newly introduced errors, skips, time, and reported friction. Record both seeded fixes on QN-J03 separately. Keep raw returns outside Git.

| Card | Facilitator scoring criteria |
| --- | --- |
| QN-J01 | Restore waiting by the reception desk if the studio fills up. Keep the advance map request. |
| QN-J02 | Keep the advance slides and a seat near the presenter. This is the faithful control. |
| QN-J03 | Restore bringing personal headphones only above 12 GBP and add video captions. |
| QN-J04 | Remove the unsupported meal. Keep support-person permission and the scheduled end time. |

Suggested invitation: “Please open the attached HTML file in Chrome. Read the source beside each draft and follow the instructions to review all four fictional cards. When finished, download the results and send back the JSON. Use only the fictional text provided.”

## Comparing participant-authored requests

Use `/evaluation.html?experiment=authored-review` for participant-authored requests and `/evaluation.html?experiment=authored-comparison` for the editable prepared draft. The two variants share four new fictional cases. In the authored variant, participants enter an action and any condition or detail, see their exact wording in the card preview, and can return to editing before approval. The export combines each action with its details on a new line and identifies the variant. Reviewers should receive one variant each. Alternate assignments among fresh reviewers and keep facilitation consistent. Keep raw returns outside Git.

| Card | Facilitator scoring criteria |
| --- | --- |
| QN-K01 | Preserve waiting by the coat rack if the gallery becomes crowded and getting a floor plan before the tour. |
| QN-K02 | Preserve advance delivery of the reading list and personal departure at 3:15 pm. |
| QN-K03 | Preserve permission to bring personal supplies if the kit costs more than £18 and request a transcript of the recording. |
| QN-K04 | Preserve permission for the support person to attend and the scheduled class end. A travel pass was never requested. |

Score these meaning checks in both variants. Note omissions, changes, unsupported requests, skips, and reported friction. The authored variant starts with empty fields, so compare the final approved meaning across variants. Give participants the HTML file alone and ask them to return the downloaded JSON.
