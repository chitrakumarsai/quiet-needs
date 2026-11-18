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
