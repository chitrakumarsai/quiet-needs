# Recovery checkpoints

Append a new entry before a complex detour, phase transition, or significant handoff. Preserve older evidence; corrections get a dated note. Do not include private text, secrets, or debug tokens.

## CP-001 — Initial participant slice

- Date: November 15, 2026 IST.
- Phase/task: P1 / P1-T01.
- Status: blocked on dependency installation.
- Branch/last validated commit: none; workspace is not a Git repository.
- Implemented: participant UI, device-only adapter, manual example/editing, consent, preview, local export.
- Verified: six dependency-free Node tests passed; initial starter ZIP integrity passed.
- Unverified: dependency resolution, typecheck/build, browser UI, actual inference, network privacy.
- Blockers: QN-001 registry DNS; QN-002 Firebase/browser setup.
- Return point: install dependencies, perform P1-T02 checks, continue P1-T03.

## CP-002 — Design and drift-plan revision

- Date: November 15, 2026 IST.
- Phase/task: P1 / P1-T01 remains the active implementation task.
- Change: user requested modern UI/UX tooling and supplied the Managing Plan Drift shared conversation.
- Baseline: execution-plan v1.1; added DESIGN.md and this checkpoint log.
- Source verified: full shared conversation read in browser. QN-003 resolved.
- Research: primary repository pages checked for popularity, Codex support, and setup instructions.
- Tool status: no design skills, component packages, or MCP servers installed in this update. Codex CLI not available on the current shell PATH.
- Branch/last validated commit: none; no Git checkpoint exists.
- Product source: unchanged in this revision. Existing six-test pass is evidence from CP-001, not a new model/browser test.
- Return point: P1-T01 installation, then P1-T02. P1-T08/T09 add design work without renumbering phases or skipping privacy gates.

## CP-003 — Architecture specification

- Date: November 15, 2026 IST.
- Active phase/task: P1/P1-T01 remains blocked; P1-T10 documentation completed independently.
- Baseline: execution-plan v1.2 and ARCHITECTURE.md v1.0.
- Decisions: client-side cloud planning for synthetic MVP; approved membership; atomic card/input revisions; private/public document separation.
- Product source unchanged. No new runtime or security-rule tests claimed.
- Git branch/commit: none recorded.
- Pending: QN-010 architecture review; QN-001 installation; QN-002 actual Firebase/device setup.
- Return point: install dependencies and run P1-T02; finish architecture review before entering P2.

Review follow-up: ARCHITECTURE.md v1.1 records the completed scenario review. Added explicit currentPlanId/planRevision, publication atomicity, membership-revocation cleanup, mutual card/event validation, and stale-read behavior. P1-T10 design review is complete; runtime checks remain unverified. Return to P1-T01 installation and remaining P1 gates.

## Entry template

- ID/date:
- Phase/task and task status:
- Linked issue and owner:
- Actual branch and last validated commit (or none):
- Files/behavior changed since last checkpoint:
- Verified evidence:
- Unverified checks:
- Next action:
- Resume-after-fix procedure:

## CP-004 — Installation and build verified

- Date: November 15, 2026 IST.
- Phase/tasks: P1-T01 and P1-T02 passed; next P1-T03 blocked on configuration.
- Linked issues/owner: QN-001 resolved; QN-002 setup owner user/implementation; QN-011 dependency remediation owner implementation.
- Actual branch: main. Repository HEAD: 9f8d53e; starter is untracked, so this is not a validated implementation commit.
- Changes: generated package-lock.json; corrected Firebase source validation to InferenceSource.ON_DEVICE; updated regression guard and progress documentation.
- Verified: npm install succeeded with approved network access; Node 22.14.0 tests 6/6; TypeScript and production build pass. Resolved Firebase 12.19.0 and Vite 6.4.6.
- Audit: four high findings in the Firebase/Firestore gRPC chain remain open; no force downgrade applied.
- Unverified: browser interactions, real local/offline inference, privacy network audit, responsive/design review.
- Exact return: configure local Firebase/App Check and supported Chrome under P1-T03, then P1-T04; compatible audit remediation remains P1 work.

## CP-005 — Bounded dependency remediation and manual browser review

- Phase: P1; parent P1-T02, issue QN-011, owner implementation.
- Return point: P1-T03/QN-002 after remediation and manual-flow smoke review.
- Evidence: Firestore pins gRPC ~1.9.0; upstream advisory lists 1.13.6 as patched. Try a scoped override, retain Firebase 12, then install/build/test/audit.
- Firebase configuration absent (.env.example only); requested project information. Real inference remains blocked.


## CP-006 — Audit clean and manual flow checked

- Date: November 15, 2026 IST. Phase P1; next task P1-T03, blocked by QN-002.
- Owner: implementation; QN-011 resolved, QN-012 queued under P1-T09.
- Branch main; previously observed HEAD 9f8d53e is not a validated starter commit.
- Changed package override/lockfile and evidence documents. No Firebase resources created.
- Passed: audit zero, build/typecheck, six domain tests, selected native Chrome manual consent/reload checks (TEST_PLAN.md).
- Pending: Firebase/App Check project configuration, real local/offline inference, network audit, full UX review.
- Return: P1-T03 when project information arrives; independently continue design tooling and QN-012 within P1. Vite remains running at http://127.0.0.1:5173/.

## CP-007 — Configured model investigation

- P1-T03/P1-T04; QN-013, owner implementation. Return: real synthetic extraction, then offline/network gates.
- All required .env.local fields present, debug enabled, file ignored by Git. Values not recorded.
- Chrome initialized local model; first synthetic extraction failed with generic UI error.
- Bounded next experiment: expose only fixed error categories distinguishing generation, source, JSON and schema failures; never log prompt/output or arbitrary SDK errors.


## CP-008 — Real extraction verified; App Check pending

- P1 remains active. P1-T03/QN-002 owner user/implementation: resolve debug-token exchange HTTP 403.
- P1-T04 and P1-T05 synthetic runs pass with responseConstraint; QN-013 resolved.
- Changed domain schema, local adapter, fixed diagnostic module, UI failure copy, and privacy regression test.
- Passed: online seating extraction; DevTools Offline timing extraction; SDK source guard; schema parser; build; 7 tests.
- Unverified: App Check authorization, full privacy audit, broader model evaluation, design gate.
- Exact return: verify debug token registration and Project ID, then P1-T06 network audit and P1-T07 evaluation. No token/config values included.


## CP-009 — App Check accepted

- P1-T03/QN-002 resolved: explicit development token saved by user; fresh Chrome exchange returned HTTP 200 and model initialized.
- No token or response body recorded. Return to P1-T06 network/privacy audit; P1 phase remains active.

## CP-010 — Participant review corrections

- P1-T06 remains active; bounded QN-012/P1-T09 correction, owner implementation.
- Return: network canary audit and model evaluation after UI checks.
- Design choice: retain side-by-side preparation/card editor, compact the introduction, show exact approved snapshot as readable requests with optional JSON. Use native modal dialog for the bounded clear confirmation; full planned design-tool/component migration remains pending.


## CP-011 — Evaluation evidence and plugin interruption

- P1-T06/P1-T07, owner implementation. QN-012 implemented with initial browser review; full gate open.
- First 30 model runs and semantic findings are in evaluation/RESULTS.md and quietneeds-synthetic-results.json. Source/schema 30/30 does not establish quality.
- Prompt changed after recorded run to address empty/conditional/negation/category failures; next exact action is second 30-case run, distinct artifact.
- Native browser call interrupted by user plugin installation request. Browser wider layout/storage/export checks incomplete.
- Ponytail marketplace and plugin 5.3.3 installed/enabled. No phase transition, deployment, or sharing implementation.


## CP-012 — Three evaluation runs and privacy evidence

- P1-T06/P1-T07; QN-014 owner implementation. QN-012 resolved with keyboard/export evidence.
- 90 actual synthetic extractions saved across R1/R2/R3. Final semantic failures E18/E22 remain; no quality pass claimed.
- Last checks: final prompt build/typecheck, production exclusion guard and 7 tests pass.
- Browser: exact downloaded JSON verified, confirm/cancel focus behavior, local/session storage checks, Firebase storage schema, empty/preparation layout at target widths. Full SDK-storage/failure-path/200% audit incomplete.
- Next bounded experiment: system-message separation on E18/E22; return to remaining P1 privacy/UX gates. No P2 work started.

## CP-013 — System-message experiment and SDK memory finding

- P1-T07/QN-014: targeted E18/E22 both passed using system initialPrompts with private note in separate user content; saved quietneeds-system-targeted.json. Full system regression next; production adapter unchanged.
- P1-T06/QN-015, owner implementation: installed @firebase/ai createSession retains oldSession until next generateContent; initialization does not replace it. Public disposal API not found. Clear page currently clears React only; cannot claim all SDK memory erased. Investigate bounded reset/disposal design and disclose limits before privacy gate.
- Exact return: full 30-case system-message run; remaining privacy and populated/zoom UX checks.


## CP-014 — Comparison complete and restart verified

- Active P1-T06/P1-T07. QN-014 quality still open; QN-015 correction verified, owner implementation.
- Total 122 saved actual extractions. Full system experiment regressed participation/scope despite targeted success; development-only.
- Participant adapter unchanged; review copy improved. Clear after preparation reloads document. Browser verified cleared content/consent and disabled inference after restart.
- Last checks: final build/typecheck, production exclusion checks, seven tests passed. Full privacy/error/SDK-record and populated/200% UX checks remain incomplete.
- Return: isolate E02 intent and E05/E30 scope before more model changes; complete remaining P1 privacy/UX/design-tool gates. No deployment/P2 work.

## CP-015 — GitHub workflow recovery

- User requested proper GitHub task handling. Found origin/main contains only initial .gitignore; application was untracked. Created feat/p1-private-participant-slice from 9f8d53e.
- Added root entrypoint/instructions, contributor and PR guidance, SHA-pinned read-only P1 CI workflow. No deployment or auto-merge.
- Next: inspect exact staged paths and secret-value exclusion, verify clean-install checks, commit, then draft PR. Public repository confirmed; only synthetic artifacts may be published. Do not claim branch protection or CI pass before observing it.


## CP-016 — Baseline committed and draft PR opened

- Branch feat/p1-private-participant-slice; validated baseline e869e926b8df58aa8f77f77310733669c1fd0482.
- Draft PR: https://github.com/chitrakumarsai/quiet-needs/pull/1. No merge or main update performed.
- Push CI run 43653989129 passed. PR CI run 43654047972 passed; GitGuardian check passed. Both apply to baseline e869e92.
- Files/configuration scanned before commit: no private local key/token values or credential patterns; caches/build output excluded.
- Remote main protection false at audit. Contributor policy is guidance; protection not implemented.
- Return to P1-T06/P1-T07 after remote CI verification; all outstanding acceptance gates retained in PR checklist/STATE.md.


## CP-017 — Repository root migration

- User requested moving all project contents out of docs/quietneeds-starter into repository root.
- Merged root/starter AGENTS.md, README.md and .gitignore; moved all remaining files including ignored local environment/dependencies/cache. Configuration preserved without printing values.
- Updated CI working directory/cache path and contributor guide. Historical checkpoint paths describe their original layout.
- Parent P1; owner implementation; return to P1-T06/P1-T07 after clean-install/build and root dev-server checks. Draft PR #1 receives this layout change.

## CP-018 — Targeted participation and scope comparison

- QN-014, parent P1-T07, owner implementation. Compare the existing system prompt with one targeted instruction change on E02/E05/E18/E22/E30 before any full rerun.
- Return to P1-T06 synthetic failure/retry and SDK storage audit, then the populated P1-T09 browser review.
- Observed 10/10 source/schema passes in Chrome. Candidate still misses a seated adjustment and repeats the materials budget. See evaluation/RESULTS.md for the per-case comparison and next bounded experiment. Build and seven tests pass.
- Browser spot checks recorded in TEST_PLAN.md. Exact return is an app-level failure and explicit retry with a synthetic marker, followed by redacted browser storage verification. Network loss alone did not fail the cached model.

## CP-019 — Remote dependency-audit failure

- QN-016, parent P1-T02, owner implementation. Push and PR checks for `3b98bbd` failed at npm audit on GHSA-fc5q-39xc-vjpf. GitGuardian passed. The registry still lists affected picomatch 4.0.7 as latest.
- Keep the audit gate. Recheck a compatible upstream release when available. Return to CP-018's P1-T06 forced failure/retry and storage check, then P1-T07.

## CP-020 — Local error recovery and prompt retest

- QN-015/P1-T06 and QN-014/P1-T07, owner implementation. Exercise the participant entry point with two simulated SDK failures, then real device retry and redacted storage checks. Compare a seated-alternative example and duplicate-request instruction on a targeted batch.
- Exact return: review the participant flow for P1-T08/P1-T09 and rerun all 30 cases only after the targeted gate passes. QN-016 stays open while the registry's latest release is affected.
- Both injected failures recovered and the real retry passed. Redacted storage scan passed. Latest prompt cleared both targeted replications, then failed semantic acceptance on E13/E25 in the full run. QN-016 reproduced locally, with registry latest still affected.
- Browser socket inspection completed in a separate synthetic run. Exact return: retest duration/interval and departure-only before repeating the full evaluation. Continue design acceptance and verify a compatible dependency fix when published.

## CP-021 — P1 gate verification

- QN-014/P1-T07, QN-008/P1-T08/T09 and QN-016/P1-T02, owner implementation. Retest departure-only and recurring breaks with numeric constraints and prior passing cases. Check the final participant layout and evaluate compatible build dependencies against the audit.
- Exact return: rerun the full synthetic suite if the targeted candidate passes and keep P2 gated until P1 evidence is complete.
- Completed 22 targeted runs and three full 30-case runs. Timing fixes held, with critical cost or multiple-request regressions in all three full runs. Participant browser recheck passed. npm audit still fails and the latest Vite retains the affected dependency.
- Return to QN-014 on E05/E19/E27 with E02/E13/E25 controls, QN-008 workspace discovery and QN-016 patched release verification. P1 is still active.

## CP-022 — P1 closure attempts

- QN-014/P1-T07, QN-008/P1-T08 and QN-016/P1-T02, owner implementation. Compare a compact extraction prompt, verify selected skill discovery, and test a clean alternative build dependency tree in a disposable directory before changing tooling.
- Exact return: full synthetic evaluation if the compact model passes, then record the gate evidence and keep any unmet requirement explicit.
- Production build, token/evaluation exclusion, npm audit and Chrome browser regression passed after adopting Rsbuild 1.7.6. Codex app-server listed all three selected workspace skills enabled. The compact candidate failed on semantic privacy and completeness. Exact return is QN-014 source-grounded verification before any new promotion.
- Follow-up: push and PR checks on 9f68d2b passed. The second-pass verification corrected E25 only and needs revision or fails on the other five synthetic drafts. The temporary harness was removed. Exact return remains P1-T07, now with participant confirmation of source constraints to evaluate.

## CP-023 — Local guards for model-generated constraints

- QN-014/P1-T07, owner implementation. Check model output for unfinished placeholders, unsupported timing or cost numerals, and introduced free-materials claims. Test against known failures and preserve manual entry.
- Exact return: run the production extraction path on the synthetic suite and review omissions and scope errors that deterministic checks cannot detect.
- Eleven automated tests and the production privacy build passed. Both 30-case on-device batches completed. Four prior failures were blocked in replay. Final batch retained five meaning or coverage failures.
- Exact return: QN-014 participant confirmation of distinct requests and source constraints before considering P2.

## CP-024 — Recover an omitted request from the private note

- QN-014/P1-T07, owner implementation. Test drafting a participant-selected passage on device and adding the result to the existing card without replacing edited requests.
- Exact return: verify the synthetic written-instructions omission through the participant interface. Keep full-note extraction acceptance separate.
- Verified real on-device recovery with an existing edited aisle-chair request. Both requests appeared in the JSON only after reapproval. Marked the selected-text workflow checked at 390 CSS pixels. Thirteen automated tests and the production build passed.
- Follow-up: two selections retained the personal 4 p.m. departure and 500 INR materials scope. Exact return is QN-014 whole-note semantic acceptance.

## CP-025 — Preserve explicit requests before model inference

- QN-014/P1-T07, owner implementation. Evaluate a local whole-note recognizer for fully matched, explicit requests. Keep all other notes on the existing model path and record the source for each result.
- Exact return: compare both paths across the original 30 cases and check unfamiliar phrasing, negation, conditions, and mixed notes before any promotion.
- Eight direct rule drafts passed in each Chrome comparison. The current model fallback yielded 26 passes, one revision and three failures overall. The constraints fallback yielded 27 passes, two revisions and one failure. Both candidates stay in development. Added a production check for the event-wide wording that slipped through in the first run.
- Direct sensory rules preserved the avoidance request in the next full run. All nine direct rule cases passed, and the full run found 29 passes and one revision. Held-out positive and abstention tests passed.
- Exact return: prevent optional stepping-out requests from gaining scheduling constraints. Verify explicit no-schedule requests still retain that condition, then repeat with mixed notes before promotion.

## CP-026 — Preserve the scope of stepping out

- QN-014/P1-T07, owner implementation. Compare a prompt that distinguishes permission to step out from a request about scheduled breaks.
- Exact return: review both original cases and fresh mixed-note controls from the real on-device run before changing the participant adapter.
- The prompt-only revisions removed the added scheduling preference but lost explicit opt-outs. Complete-clause rules preserved both tested opt-outs and the accompanying written-instructions request. All 12 rule drafts passed in the final run. The model still added a seating request and missed stepping out in separate cases.
- Exact return: QN-014 fallback coverage and scope for unfamiliar multi-request notes. The production adapter stayed on its previous path.

## CP-027 — Check request coverage against source text

- QN-014/P1-T07, owner implementation. Compare development-only source identification and drafting with the earlier single-pass candidates.
- Exact return: review all 34 existing cases and four fresh mixed notes. Check whether the first pass omits evidence or the second pass changes its meaning before considering participant integration.
- Ran both quotation and numbered-passage coverage with live Chrome. Each withheld seven drafts, and neither passed any of the four fresh cases. Numbered passages avoided literal quoting errors on those cases, exposing missed requests and a lost condition even where draft counts matched.
- Exact return: test participant confirmation of source passages through the existing selection and manual review workflow before considering any replacement of the production adapter.

## CP-028 — Confirm passages before drafting

- QN-014/P1-T07, owner implementation. Verify individual drafts from evaluator-confirmed passages in Chrome.
- Nine selected passages produced nine verified on-device requests. QN-C01 and QN-C02 passed manual review. QN-C03 changed a borrowing condition into a price limit, and QN-C04 changed a specific hallway request. Editing a selection cleared its confirmation and prior result.
- Exact return: preserve the action and condition in QN-C03 and QN-C04, then repeat on both cases and fresh mixed notes before considering participant integration.

## CP-029 — Preserve the action in confirmed passages

- QN-014/P1-T07, owner implementation. Test explicit instructions about keeping the requested action, condition, and concrete destination. Rerun QN-C01 through QN-C04 with two fresh mixed notes.
- Chrome produced 13 requests across six notes. Manual review recorded three passes, two revisions, and one failure. Both fresh controls passed. The borrowing action and timing and noise qualifiers still drifted.
- Exact return: evaluate whether requiring an exact action and condition in the draft catches the observed drift before participant review, including the advertised-end regression.

## CP-030 — Flag changes to confirmed requests

- QN-014/P1-T07, owner implementation. Replay the observed borrowing, event-end timing, and hallway changes and verify the prototype with a real on-device draft.
- Chrome withheld the borrowing draft and exposed two headset errors. Replay now rejects the dropped headset action and an unsupported second request. Nineteen tests and the production build passed.
- Exact return: measure omissions and unnecessary flags against fresh notes before considering participant integration. QN-014 remains open.

## CP-031 — Test the wording checks on unfamiliar passages

- QN-014/P1-T07, owner implementation. Compare faithful paraphrases and altered requests on four fresh notes, then review actual drafts in Chrome.
- Offline replay flagged three of four faithful paraphrases and missed four intentional changes. In Chrome, the check correctly withheld one draft, accepted one faithful draft, and let two meaning changes through.
- Exact return: retain source and draft side by side during participant review. Evaluate whether people catch omissions and changes without a word-matching gate before considering integration.

## CP-032 — Prepare and verify the participant review exercise

- QN-014/P1-T07, owner implementation. Built a fictional four-card review exercise with a faithful control and seeded changes or omissions.
- The Chrome walkthrough verified editing, blank-draft validation, approval, skip, focus, and the downloaded review record. The facilitator guide defines the meaning checks.
- Exact return: run independent participant sessions, score the approved text, and record assistance and friction. QN-014 remains open.

## CP-033 — Prepare the participant pilot

- QN-014/P1-T07, owner implementation. Packaged a standalone fictional review exercise and facilitator packet with invitation and scoring criteria.
- Verified all four cards and the exported JSON in Chrome from a local file. The exercise needs no server or account.
- Exact return: arrange independent reviewer sessions and collect their exercise exports before scoring. The local walkthrough remains implementation verification.

## CP-034 — Score the first participant review

- QN-014/P1-T07, owner implementation. Scored one returned participant export against all four fictional cards. One of four seeded issues was corrected, three remained in approved text, and the faithful control passed.
- Exact return: collect and score the other two planned pilot sessions using the same exercise. Compare missed errors, skips, and reported friction before changing the review design. The raw return remains outside Git.

## CP-035 — Score the second participant review

- QN-014/P1-T07, owner implementation. The second participant corrected the captions omission and approved the same three remaining errors as the first participant. Both faithful controls passed.
- Exact return: score the remaining planned pilot session using the same exercise, then use the repeated misses to prioritize review changes. The raw return remains outside Git.

## CP-036 — Complete and score the three-participant pilot

- QN-014/P1-T07, owner implementation. Scored all three pilot returns. Three of 12 seeded errors were corrected and nine remained in approved text. All three faithful controls passed.
- Exact return: prototype focused review prompts for actions, conditions, locations, and requests added without source support. Retest on fresh fictional cases. Raw participant exports remain outside Git.

## CP-037 — Prepare the guided review comparison

- QN-014/P1-T07, owner implementation. Added prompts for requested actions, conditions and details, and unsupported additions. A matched unguided exercise uses the same fresh fictional cards.
- Chrome verified approval gating, checks resetting after edits, and both standalone downloads.
- Exact return: collect fresh participant results with one variant per reviewer, compare corrections, misses, and friction between variants, and keep raw returns outside Git.

## CP-038 — Score the first matched review returns

- QN-014/P1-T07, owner implementation. Scored one guided and one unguided export. Each corrected the same two of four seeded issues and left a missing location and unsupported parking request in approved text.
- Exact return: score additional fresh returns from each variant before drawing a comparison. Keep the current cases and instructions fixed. The raw exports remain outside Git.

## CP-039 — Score the second matched review returns

- QN-014/P1-T07, owner implementation. Scored the second return for each variant. Both variants have four of eight seeded issues corrected. All four returns still miss the location and unsupported parking request.
- Exact return: score one additional fresh return per variant on the same exercise, then decide whether to test review prompts on each request.

## CP-040 — Complete the guided review comparison

- QN-014/P1-T07, owner implementation. Scored the final pair. Both variants corrected six of 12 seeded issues. All six reviewers missed the main entrance and unsupported parking. No skips or new errors.
- Exact return: prototype review of each draft request against the source and include a check for omitted requests. Compare against the current exercise using fresh fictional cases.

## CP-041 — Prepare request-by-request review

- QN-014/P1-T07, owner implementation. Built matched exercises on four fresh fictional cards. The new variant checks each request and includes a separate omission check.
- Chrome verified edits clearing confirmations, adding missing requests, removing unsupported requests, and the exported approval record.
- Exact return: compare fresh participant results in both variants. Focus on corrected locations, removed unsupported requests, missed details, and friction.

## CP-042 — Score the first request-by-request returns

- QN-014/P1-T07, owner implementation. Scored the request-by-request export and matched comparison. Each corrected two of four seeded issues. Both still changed the waiting location and approved an unsupported meal.
- Exact return: assess the request-by-request flow with fresh matched returns before deciding whether to promote it. The raw exports remain outside Git.

## CP-043 — Complete the request-by-request comparison

- QN-014/P1-T07, owner implementation. Scored six distinct returns. Both variants corrected eight of 12 seeded issues. Neither corrected the reception-desk location, and each removed the unsupported meal in two of three sessions.
- Exact return: prototype participant-authored requests with explicit conditions and details before showing a proposed draft. Use fresh fictional cases. Raw participant exports remain outside Git.

## CP-044 — Prepare participant-authored request comparison

- QN-014/P1-T07, owner implementation. Built a variant where participants enter actions and associated details before preview. The matched comparison uses the same fictional cases.
- Chrome verified blank action validation, preview, editing, approval, skips, and the exact authored download.
- Exact return: collect fresh returns for both variants and score preservation of locations, conditions, and requested actions, alongside new unsupported requests and friction.

## CP-045 — Score the participant-authored returns

- QN-014/P1-T07, owner implementation. Scored three authored exports, counting the paste and its matching file once. All 12 cards passed. Approved wording was identical across returns. Times and reported friction differed.
- Exact return: score the three prepared-draft comparison returns before comparing the two exercises. The raw exports remain outside Git.

## CP-046 — Complete the participant-authored comparison

- QN-014/P1-T07, owner implementation. Scored the three prepared-draft returns. Both variants passed 12 of 12 cards. The prepared-draft users repaired every seeded issue. Within each variant the approved wording matched across its three returns.
- Exact return: decide the launch scope for automatic extraction and the evidence required to close QN-014. The raw exports remain outside Git.

## CP-047 — Close P1 with the approved manual-entry scope

- QN-014/P1-T07, owner implementation. User approved manual-entry release. The participant build supports editable requests, preview, explicit approval, and local JSON download. Inference remains available in the development evaluator.
- Verified the production build in Chrome. Incomplete drafts cannot preview, approval gates download, edits clear the preview, and the exported JSON matches the revised card. Clearing and focus return passed.
- Exact return: begin P2 approved sharing using the P1-T10 architecture review. Evaluate QN-014 separately before promoting automatic extraction.

## CP-048 — Implement P2 approved sharing

- QN-017/P2, owner implementation. Implement account identity, organizer-approved enrollment, and revisioned approval and withdrawal. Verify access rules and two isolated sessions before closing P2.
- Passed rules tests and two-tab Chrome checks for organizer approval, exact card share, replacement, withdrawal, revocation, and approval reset after acknowledgement. The local P2 implementation gate passed. Hosted configuration and Google sign-in remain unverified.
- Exact return: review P2 against P1 and use the auth/event/card contract for P3 organizer planning. Hosted sign-in still needs isolated project enablement and verification.

## CP-049 — Implement P3 organizer adaptation

- QN-018/P3, owner implementation. Build an allowlisted planning input, verified agenda options, organizer proposal review, revisioned publication, and participant confirmation. Verify the live cloud boundary separately from the emulator.
- Chrome returned a genuine structured cloud proposal for a fictional event. It tied a seated alternate to a verified fact, reported the conflicting standing-only request, and left step-free access unknown. The withdrawn marker was absent from the cloud input.
- Safari verified sharing, organizer-approved publication, participant confirmation, organizer feedback, and stale status after withdrawal across two demo sessions. The rules suite also denied the previous plan and confirmation when replaced with the same input revision.
- Exact return: P4, QN-006. Verify offline shell reload and explicit server acknowledgement for event writes. Independent trials and hosted provider verification remain pending.

## CP-050 — Cache the production app shell

- QN-006/P4, owner implementation. Cache built assets only and keep the offline workspace focused on manual entry, review, and download. Verify a warm reload, an empty draft after reload, and server acknowledgement for event writes.
- Safari reloaded without the local preview server and downloaded a new fictional approved card. The prior draft cleared. Firestore checks cover event creation with the emulator available and rejection when the connection is dropped.
- Exact return: P4 accessibility and recovery regression for participant and organizer. Continue independent trials and retention review before closing P4.

## CP-051 — P4 accessibility and recovery

- QN-019/P4, owner implementation. Review keyboard focus for added requests and agenda fields, narrow event layout, and recovery from unconfirmed event writes. Verify in the local two-role demo.
- Safari verified new-field focus, a specific time-zone error with title retained, and correction of a backwards agenda time range with the draft retained. The saved time range appeared in the exact publish preview after refreshing event access.
- Exact return: P4 cross-role privacy regression with fictional records and a network trace. Full viewport and independent trial coverage remain pending.

## CP-052 — P4 cross-role browser regression

- QN-020/P4, owner implementation. Trace fictional sharing, replacement, withdrawal, and cloud planning payloads. Check keyboard and populated viewport behavior. Keep captured request bodies and credentials out of Git and report aggregate evidence.
- Two local sessions and a separate cloud fixture passed request marker and field checks. No private marker appeared in captured participant requests. The withdrawal write contained zero requests. The populated role views fit all three widths. Chrome keyboard navigation reached the approved download button.
- Exact return: run the independent organizer trials described in TEST_PLAN.md. Continue retention and broader accessibility evidence before closing P4.

## CP-053 — Review the independent organizer returns

- QN-021/P4, owner implementation. Two organizers completed the standalone trial and found revision-specific feedback. Both recognized the seating conflict and the unverified entrance. Both questioned publication with unresolved requests and wanted clearer feedback scope.
- Exact return: put unresolved requests next to the publish approval and clarify the scope of revision-bound feedback. Hosted organizer trials, retention, and broader accessibility remain open.

## CP-054 — Provision Firestore for the hosted trial

- QN-017/P4, owner implementation. Enabled the Firestore API after the initial create request returned 403. Verified the project had no databases before creating its default database in the requested `us-east1` location.
- Firebase reported Standard edition, native mode, and free-tier eligibility. The repository rules compiled and were released. A signed-out REST query to the events collection returned `403 PERMISSION_DENIED`.
- Exact return: QN-021 remains the next implementation task. Hosted testing still needs Google sign-in, a preview URL, and two signed-in synthetic sessions.

## CP-055 — Prepare the hosted trial preview

- QN-017/P4, owner implementation. Configure Google sign-in with the selected support account, publish a temporary Hosting preview, and verify its sanitized production build and auth setup.
- Enabled Google sign-in and deployed the seven-day `p4-trial` preview. Chrome displayed the sign-in control. The Identity Toolkit API returned a Google OAuth URL for the preview origin. The app shell and worker both served with `no-cache`, and the development evaluator returned 404.
- Exact return: QN-021 remains the next implementation task. Complete the hosted workflow with separate Google identities and verify preview-domain App Check before enabling organizer cloud proposals.

## CP-056 — Prepare the combined P4 test run

- QN-021/P4, owner implementation. Finish the publish and feedback fields, confirm hosted configuration prerequisites, and consolidate the P4 acceptance checks.
- Placed unresolved proposal references and unverified venue facts beside organizer approval. Clarified whole-card feedback for each published revision. Added the exact preview domain to the reCAPTCHA allowlist while preserving the existing domain checks.
- Exact return: run the combined P4 checklist in TEST_PLAN.md. Browser attestation and hosted signed-in acceptance are pending. Cloud proposals stay off in the manual preview until attestation is verified.

## CP-057 — Restore hosted Google sign-in

- QN-017/P4, owner implementation. Reproduced the hosted sign-in error in Chrome. The in-memory Firebase Auth instance needed the browser popup resolver supplied to the Google sign-in call.
- Passed 22 automated tests and the production privacy build. The hosted service worker matched the rebuilt version. A fresh Chrome tab opened Google's account chooser from the preview.
- Exact return: complete sign-in with two separate Google identities and resume the combined P4 checklist in TEST_PLAN.md.

## CP-058 — Remove reloads from hosted event enrollment

- QN-022/P4, owner implementation. The hosted trial surfaced an unlabeled choice between starting an event and joining one, an invite without a visible code, and repeated sign-ins while checking for access updates.
- Considered a role chooser and two labeled sections. Chose the sections so testers can find either task without an extra click. Show the existing event code alongside the link and use server-confirmed access updates.
- Chrome with two emulator identities verified invite by code and link, live request and approval, share/replace/withdraw, revocation, Back/Forward, reload with sign-in and a blank draft, and sign-out.
- Exact return: verify two-role enrollment, session reload, and sharing in the combined P4 checklist.

## CP-059 — Record the hosted sharing result

- QN-017 and QN-022/P4, owner implementation. The user reported that all seven steps of the updated hosted run passed, covering sign-in, event link and code, live requests and admission, sharing, replacement and withdrawal, and same-tab reload.
- Exact return: QN-021, verify hosted manual publication and revision-bound participant feedback using the combined P4 checklist in TEST_PLAN.md.

## CP-060 — Verify P4 hosted publication and privacy

- QN-021/P4, owner implementation. Verify organizer approval and published fields using a dedicated synthetic event, then check App Check on the preview origin and look for private draft text in browser storage.
- Hosted Chrome published revision 1 and showed the unverified fact before approval. An isolated emulator run verified both feedback revisions, stale-response rejection, withdrawal, and removal of the fixture and its six child documents.
- The v3 exchange returned HTTP 400. The preview project is registered for Enterprise. After the provider change, the Enterprise exchange and the synthetic cloud request both returned HTTP 200, and the SDK returned `IN_CLOUD` with no withdrawn or identity markers in the request.
- The loopback production storage audit found zero matches in web storage, one IndexedDB record, and six cached response bodies. Reload with the server stopped repopulated the shell with an empty editor.
- Restored the normal hosted preview with the verified Enterprise provider and cloud planning enabled. Removed the disposable hosted publication fixture and confirmed it has no remaining child collections.
- Exact return: verify participant feedback against the hosted agenda revision, then complete the remaining P4 checklist in TEST_PLAN.md.

## CP-061 — Refine the participant and event workspaces

- QN-019/P4, owner implementation. Compared a staged editor with a compact paired editor and review. Chose the paired workspace to keep exact review visible on wide screens and preserve the established task sequence on mobile. Apply UI UX Pro Max and Taste Skill to the live controls, spacing, and type.
- Chrome verified 390/768/1440 layout without horizontal overflow, preview focus, keyboard approval, consent invalidation, dialog cancel focus restoration, and invalid join-code feedback. Twenty-two tests and the production privacy build passed. The three pasted prompts were unavailable as text during the first pass.
- Exact return: review the refreshed workspace at desktop and mobile widths, then resume hosted participant feedback and remaining P4 acceptance in TEST_PLAN.md.

## CP-062 — Compare three live design directions

- QN-019/P4, owner implementation. Use the same participant and organizer UI for independent minimalist, experimental, and hybrid previews. Prioritize the edit-to-approval path, focus, loading feedback, event entry, and meaningful card art.
- Chrome verified nine viewport and theme combinations, keyboard approval across themes, mobile invalid-code focus, and the two-role emulator flow through publication and feedback. Key contrast checks, 22 tests, and the privacy build passed. The comparison controls are present only in development.
- Exact return: present the three previews for selection, then apply the chosen direction and resume P4 acceptance.
- November 22: the user selected C. Promoted its card illustration and review surface to the production build and kept the comparison controls in development. Return to the hosted feedback round trip after verifying the preview.

## CP-063 — Run the independent P4 technical checks

- QN-006, QN-019, QN-020, QN-021/P4, owner implementation. Verified controlled cloud fallback to manual publication, signed-in hosted browser storage, offline export in Chrome, and hosted keyboard focus recovery. All marker and event content was fictional.
- Exact return: verify the two-role hosted cloud and feedback journey, then collect OS-level offline and spoken screen-reader evidence. TEST_PLAN.md separates demonstrated outcomes from remaining checks.

## CP-064 — Public landing and routed workspace

- QN-019 and QN-022/P4, owner implementation. Keep the existing identity, membership, event, card, and planner contracts. Introduce a pre-rendered public page and explicit app routes. Verify new deep links, legacy invitations, offline routing, and privacy.
- Local acceptance: 22 tests, two Firestore rules tests, production privacy scan, and five Lighthouse routes passed. Chrome confirmed consent invalidation, invitation code and QR, live admission, sharing, manual publication, and participant feedback with demo accounts.
- Exact return: review the routed preview and resume the hosted feedback and remaining P4 checks. Event date, location, description, joined-event indexing, and pre-admission details require a separate data decision.

## CP-065 — QuietNeeds motion and reduced-motion controls

- QN-019/P4, owner implementation. Define shared timings and reduced-motion behavior first. Apply them to the landing, card editor, and event flows while preserving approval, draft isolation, and keyboard focus.
- Chrome verified opt-in illustration playback, pause, reduced-motion preference across pages, stable labels and focus after request edits, new event invitations, and copy toast dismissal. The final Lighthouse run cleared the route targets.
- Exact return: verify both motion modes and rerun local production Lighthouse, then resume the hosted feedback and remaining P4 checks in TEST_PLAN.md.

## CP-066 — Resume hosted P4 acceptance

- QN-021/P4, owner implementation. Draft PR #18 has passing CI at `73f08cd`. The `p4-trial` channel still serves the earlier single-page workspace. Refresh that preview with the routed candidate and verify the deployed build before testing with two Google identities.
- Deployed preview version `f04b0dc3ccce181d`. Production privacy checks, 23 tests, direct HTTPS routes, and one Google sign-in in Chrome Incognito passed. The two-role run is waiting for a second authenticated session.
- Exact return: the organizer publish and feedback row of the combined P4 run in TEST_PLAN.md, including card replacement and feedback isolation across revisions.

## CP-067 — Hosted feedback after card replacement

- QN-021/P4, owner implementation. Safari organized a fictional workshop and Chrome participated. A cloud proposal passed the SDK source check, revision 1 was published, and the organizer received the participant’s unmet response. Chrome showed that the replacement card made the agenda out of date.
- Safari reloaded with sign-in retained and showed only the replacement request in the new cloud preview. Revision 2 started with no feedback, accepted a new unsure response, and became stale after withdrawal. Safari needed manual recovery to surface two cross-role updates.
- Operator cleanup removed the fictional fixture and its descendants. The follow-up read returned 404 and listed no child collections.
- Exact return: reproduce Safari organizer updates with both windows visible and continue the remaining P4 checks in TEST_PLAN.md.

## CP-068 — Apply the dark and light visual system

- QN-019/P4, owner implementation. Apply the requested visual tokens to the routed workspace and landing. Keep the QuietNeeds identity, production manual-card boundary, and existing Firebase contracts. Verify theme contrast, command keyboard behavior, reduced motion, and responsive layouts before returning to hosted acceptance.
- Chrome passed the keyboard workflow and offline font load. The rendered landing and workspace fit the tested 320–1440 px widths. Lighthouse mobile scored 100 for performance and accessibility on the landing. See TEST_PLAN.md for independent review limits.
- Exact return: reproduce Safari organizer updates and complete the existing P4 network and spoken screen-reader checks. The visual redesign has local evidence.

## CP-069 — Verify the approved design for live Hosting

- QN-019 and QN-022/P4, owner implementation. Preserve the approved design, verify fixes for mobile touch targets and command-dialog state, and check the release candidate before promoting it to Firebase Hosting. Keep real-participant retention and data-handling requirements open.
- Chrome verified the release fixes. PR #18 merged after CI and GitGuardian passed. The live Hosting demo passed route and mobile browser smoke checks. The design gate has 28 open findings and 11 warnings.
- Exact return: the Safari organizer live-update and spoken screen-reader rows of the P4 acceptance checklist.

## CP-070 — Implement request outcomes

- QN-023/P4, owner implementation. Add organizer decisions and participant responses to the current event workspace. Publish per-card outcomes atomically alongside the agenda, enforce authorization in Firestore, and preserve whole-card feedback for previously published agendas.
- Local Chrome verified desktop organizer and mobile participant flows. Firestore emulator verified request isolation, stale response denial, concurrent responses and publication at the 25-card boundary.
- Exact return: verify the two-role request outcome flow, then resume the Safari organizer live-update and spoken screen-reader checks.
- November 24: preview version `3232b662f156c8c8` and its rules are deployed and verified. Chrome reached the signed-in event directory. Resume once Safari is signed in with a separate Google account. Live Hosting is still on the earlier frontend.
- November 24: distinct Google sessions reached the fictional event. Chrome submitted a join request and Safari confirmed admission. The Chrome reload left a blank original tab, and a fresh tab showed the signed-out header. Exact return: recover the Chrome participant view at the existing fictional event, before approving a card.
- November 24: PR #19 merged at `5480763`. The user requested production promotion after manual testing. Firebase released version `3232b662f156c8c8` to live, and production smoke checks passed. Exact return: the remaining authenticated outcome and replacement checks in TEST_PLAN.md.
- November 24: live Chrome participant and Safari organizer passed approved sharing, a planned and a still-checking request, per-request feedback, and replacement followed by a clean republish. Organizer checks used the explicit refresh controls. Exact return: the physical network disconnect, spoken screen reader, and Safari live-update checks already open in TEST_PLAN.md.

## CP-071 — Isolate the Safari live-update follow-up

- QN-022/P4, owner implementation. Separate the automatic join-request and card-replacement checks from the manual participant-feedback refresh. Safari opened the live event directory signed out and returned “Sign-in could not be completed. Try again.” The hosted two-role reproduction stopped before any event changes.
- Passed locally: 24 tests, three Firestore emulator tests, and the production privacy build. The rules suite observed a join request through the app's subscription and checked approved-card replacement and response revision isolation.
- Exact return: restore the two hosted test sessions, leave both windows visible, and time a fresh join request and a card replacement before touching the refresh controls. Continue the OS-level disconnect and spoken VoiceOver checks separately.

## CP-072 — Close P4 and start P5

- The user approved P4 closure and made the three remaining browser and Mac checks non-blocking. Preserve the recorded limits and use the implemented request-outcomes workflow for the submission.
- QN-024/P5, owner implementation. Add Switch account to the shared landing and workspace account menu. Show the current Google email where available. Use the Google account chooser while keeping the existing session active until authentication succeeds. Event access and card approval follow the authenticated user ID.
- Passed local tests, production privacy build, emulator identity switching, and a simulated closed-popup check. The signed-in browser walkthrough and real Google chooser are pending.
- Exact return: verify the Google chooser with two identities on a hosted candidate, then run the P5 judge walkthrough and submission checklist.
