# Change log

## 2026-11-23 — P4 technical verification

- Verified manual publishing after a controlled cloud rejection, signed-in hosted draft storage, tab-isolated offline export, and hosted keyboard focus recovery.

## 2026-11-22 — Balanced Hybrid release design

- Adopted the selected Balanced Hybrid workspace for production, including the original card illustration and the paper-like review surface.

## 2026-11-21 — Workspace design comparison

- Added three live design directions with their own type, color, layout, and SVG treatments. Improved loading, pressed, validation, and completion feedback across the shared workflow.

## 2026-11-20 — P4 acceptance preparation

- Refined the participation editor, review surface, and create/join forms. Added workspace jump links and moved keyboard focus to the exact card when previewing.
- Matched organizer App Check to the project's reCAPTCHA Enterprise registration. Verified hosted production attestation and a fictional cloud proposal, manual publication, local feedback revision isolation, and a browser-storage audit.
- Recorded the user-reported pass for the updated two-account hosted invitation and sharing flow.
- Separated event creation from joining, added copyable invite links and event codes, and moved join requests above agenda planning. Join requests and membership update automatically. Firebase sign-in survives a reload in the same tab.
- Fixed the hosted Google sign-in button by supplying Firebase's browser popup resolver. Verified that the updated preview opens Google's account chooser in Chrome.
- Put open requests and unverified venue facts next to publish approval. Clarified whole-card feedback and documented a combined hosted, privacy, accessibility, and cleanup test run.

## 2026-11-19 — Hosted trial preview

- Configured Google sign-in and deployed a seven-day Hosting preview for manual organizer planning. Verified OAuth startup, the hosted shell, and service worker cache headers.

## 2026-11-19 — Firestore hosted trial setup

- Created the demo Firestore database in `us-east1`, deployed the checked-in rules, and verified that a signed-out events read is denied.

## 2026-11-19 — Organizer trial findings

- Recorded both independent standalone returns. Tracked two usability findings around unresolved requests at publication and the scope of participant feedback.

## 2026-11-19 — Shareable organizer exercise

- Added a standalone fictional organizer trial with agenda review, a practice publication, simulated revision-specific feedback, and a local JSON results download.

## 2026-11-19 — P4 browser regression evidence

- Verified fictional share, replacement, withdrawal, and cloud planning requests. Recorded populated layout and keyboard results and a brief for independent organizer trials.

## 2026-11-19 — P4 focus and recovery

- Added a skip link and focus placement in newly added requests, venue facts, and agenda slots. Event fields and long codes wrap within narrow layouts.
- Added actionable time-zone feedback and kept the last confirmed event view during temporary write failures. Revision and membership updates wait for server snapshots.

## 2026-11-19 — P4 offline manual workspace

- Cached production app files so a previously visited workspace can reopen when the server is unreachable. Manual entry and download work from the cached shell, with a new draft after reload.
- Event creation uses a server-acknowledged transaction. Event controls pause when the browser reports it is offline.

## 2026-11-19 — P3 organizer adaptation

- Added agenda options, venue fact checks, and optional Firebase AI Logic proposals using approved requests. Organizers choose and review an exact agenda before publishing it.
- Added participant confirmation and organizer feedback for each current plan revision. Card or agenda changes retire the prior plan.
- Verified a genuine synthetic cloud proposal and two-session local publication, confirmation, and withdrawal. The demo supports three agenda slots and three venue facts.

## 2026-11-18 — P2 approved event sharing

- Added sign-in, event creation, organizer-approved enrollment, revisioned card sharing, withdrawal, and membership revocation. Validated the access rules and ran the workflow with two synthetic accounts in Chrome.

## 2026-11-18 — P1 manual-entry release

- Completed the approved participant slice with manual request entry, an exact preview, explicit approval, and local JSON export. Automatic extraction remains available in the development evaluator.

## 2026-11-18 — Participant-authored review comparison

- Added a fictional exercise where reviewers enter actions and details before preview. Prepared a matched comparison and verified the exact approved wording in the authored download.

## 2026-11-18 — Request-by-request review comparison

- Added a development exercise that confirms each request and checks for omissions before approval. Prepared the matching unguided exercise and verified the guided download in Chrome.

## 2026-11-18 — Guided participant review comparison

- Prepared guided and unguided review variants with the same fresh fictional cases. The guided checks reset when the draft changes. Chrome verified both downloads and the guided approval flow.

## 2026-11-18 — Participant review exercise

- Added a four-card fictional exercise for reviewing source and draft together. Chrome verified approval, editing, skipping, and the results download. The facilitator guide covers independent review and scoring.

## 2026-11-18 — Fresh wording controls

- Compared the confirmed-passage checks against four fresh fictional notes in offline replay and live Chrome. The checks missed changes and flagged faithful paraphrases, so the experiment remains in development.

## 2026-11-18 — Confirmed passage checks

- Added development checks for observed changes to borrowing, personal equipment, scheduled end times, and hallway requests. The evaluator flags the passage and withholds the combined draft.

## 2026-11-18 — Confirmed passage wording comparison

- Compared guidance about preserving the requested action, condition, and destination. Chrome drafted 13 passages across six notes. Both fresh controls passed. Other drafts still changed borrowing, scheduled event timing, or a noise qualifier.

## 2026-11-18 — Confirmed passage evaluation

- Verified manual passage confirmation and nine on-device drafts in Chrome. Two of four mixed notes passed review. The remaining drafts changed a borrowing condition and a specific hallway request.

## 2026-11-18 — On-device request coverage evaluation

- Evaluated source quotations and numbered passages before drafting, using 38 synthetic cases that included four new mixed notes. The guards withheld seven drafts in each completed candidate. Neither candidate passed any of the four new cases, so both remain development-only.

## 2026-11-18 — Stepping-out scope and mixed notes

- Added four mixed-note cases and tested two prompt changes and a recognizer that combines fully understood clauses. The latest candidate preserved requests to step out and explicit preferences about scheduled breaks, with 12 passing rule drafts. Model output still added or omitted other requests, so the candidate remains development-only.

## 2026-11-18 — Preserving explicit requests

- Evaluated complete-note local rules with two on-device model fallbacks. The latest Chrome run passed 29 of 30 overall, including all nine direct rule drafts, with one revision for an unsupported scheduling preference. The experimental path remains development-only.
- Expanded the production schedule-scope check to catch the observed “end this event” substitution for a personal departure and verified that explicit requests to change the event schedule still pass.

## 2026-11-18 — Recovering a missing request

- Added an on-device action that drafts from a selected passage of the private note and keeps existing requests.
- Approval guidance now asks participants to confirm coverage, scope, amounts, timing, and conditions. An addition clears prior approval.
- Chrome verified keyboard recovery of the written-instructions request, reapproval, and the exact JSON. Thirteen tests and the production build passed.

## 2026-11-18 — Local extraction constraint checks

- Added a local check before an AI draft reaches review. It blocks common unsupported numerals, unresolved placeholders, introduced free costs, some dropped durations, and recognizable event-wide schedule substitutions. Exact duplicate requests are removed. Manual entry and approval stay available.
- Replayed 272 prior and interim drafts and ran two 30-case on-device evaluations. Four historical failures were blocked. The final live batch still has five semantic failures, so QN-014 remains open.

## 2026-11-18 — P1 toolchain and skill closure

- Replaced Vite with Rsbuild 1.7.6 to remove the affected dependency chain. Existing Firebase configuration names and participant behavior were verified. Seven local tests, production exclusions and the dependency audit passed.
- Installed and verified three selected project skills and recorded their versions. Kept the browser-tested native controls.
- Rejected the compact prompt after on-device evaluation reproduced private-detail and coverage failures. QN-014 remains open.
- Both GitHub participant checks and GitGuardian passed. A separate local draft correction experiment also failed model acceptance and was discarded.

## 2026-11-18 — P1 gate follow-up

- Completed the participant browser recheck at 390/768/1440, 200% zoom, keyboard approval and reduced-motion confirmation.
- Recorded three full on-device prompt comparisons and a repeated targeted batch. Departure and break timing improved. Budget scope and omission of a second request still block promotion.
- Passed seven tests and the production build. Current Vite still resolves the affected picomatch release, so the high-severity audit remains red.

## 2026-11-18 — P1 recovery audit and responsive controls

- Verified safe recovery from synthetic SDK rejection and malformed JSON, a real on-device retry, and redacted browser storage checks.
- Improved keyboard focus, form-control boundaries, and private-entry guidance. Browser keyboard review confirmed that an edit revokes consent and hides the prior preview.
- Evaluated the seated and attendance example candidate. It passed both targeted replications and still failed the full semantic gate on departure and break constraints. No production prompt promotion.
- Local tests and build passed. The dependency audit still flags QN-016.

## 2026-11-18 — Targeted P1 model and browser checks

- Added a development-only, five-case prompt comparison. Both batches passed source/schema checks. Semantic review found the candidate still misses seated participation and duplicates the scoped materials budget.
- Recorded synthetic Offline and online repeat evidence, populated responsive spot checks, approved JSON at 200% and reduced-motion dialog focus.
- Passed seven tests, production build and privacy guards. App-level failure/retry and browser storage record-content checks remain open.
- Remote CI audit failed after a new advisory for Vite's picomatch dependency. Registry latest is still affected. Recorded QN-016 and kept the audit gate.

## 2026-11-15 — Real local and offline inference

- Verified required local configuration fields and Git exclusion without recording values.
- Diagnosed invalid JSON from real on-device response; added bounded JSON responseConstraint to Firebase onDeviceParams. Kept source checking, strict parser, human approval, and ONLY_ON_DEVICE mode.
- Added fixed privacy-safe failure categories and test preventing arbitrary error/private-text disclosure. Build/typecheck and tests 7/7 pass.
- Real Chrome online seating extraction and DevTools Offline timing extraction succeeded. Restored No throttling afterward.
- App Check exchangeDebugToken returns HTTP 403; QN-002 remains open. Offline network panel showed failed App Check request with zero bytes; this is not a comprehensive privacy audit.
- Unnecessary location clarification recorded for model evaluation. No cloud inference, deployment or phase advance.


## 2026-11-15 — Dependency remediation and browser smoke review

- Scoped Firestore gRPC override to 1.13.6; refreshed lockfile. npm audit now reports zero vulnerabilities.
- Passed production build/typecheck and all six domain tests after update.
- Chrome manual review passed: disabled AI without config, fictional sample labeling, empty-request gating, explicit approval, allowlisted preview without clarification questions, edit/note invalidation, and reload clearing.
- QN-012 tracks human-readable preview and clear-session confirmation. Full responsive, keyboard, download-byte comparison and network audit remain unverified.
- Firebase configuration absent; requested project details. Native Chrome worked after browser-host discovery failed and Safari access timed out.


## 2026-11-15 — Dependency installation and build verification

- Installed project-local dependencies and generated package-lock.json; resolved QN-001 using approved network access.
- Fixed local inference-source validation to use Firebase’s InferenceSource.ON_DEVICE constant and updated the static regression guard.
- Passed: six domain tests, TypeScript check, Vite production build on Node 22.14.0.
- Failed initial attempts: sandbox npm DNS; test command under login-shell-selected older Node; initial typecheck against incorrect uppercase source literal. All three were resolved.
- Open: QN-011 records four high npm audit findings in the Firebase/Firestore gRPC chain. Browser/network audit and actual device inference remain unverified.
- No Firebase configuration, deployment, or design-tool installation performed.

## 2026-11-15 — Architecture baseline

- Added ARCHITECTURE.md with system diagram, lifecycle, client/cloud boundaries, Firestore contracts, permissions, revision transactions, failure behavior, retention, and test gates.
- Added P1-T10 architecture review without renumbering phases. Specification complete; review and runtime verification remain pending.
- Updated decisions and checkpoint CP-003. Product source unchanged; no paid services enabled.
- Architecture review follow-up: resolved stale-plan confirmation, revocation/withdrawal, and atomic invalidation ambiguities; recorded review evidence and pending implementation tests. P1-T10 complete at design level only.

## 2026-11-15 — Codex CLI workflow

- Added CODEX_CLI.md, a stored kickoff prompt, and a directory-safe CLI launcher.
- CLI not found on PATH; npm lookup failed with ENOTFOUND. No installation, authentication, or real CLI run claimed.

## 2026-11-15 — Execution plan v1.1

- Read the full Managing Plan Drift shared conversation and resolved QN-003.
- Added checkpoint log, 15-minute investigation review, recovery protocol, and planned enforcement checks.
- Added DESIGN.md, modern UI/UX acceptance criteria, researched repository comparisons, dated star snapshots, and Codex setup steps.
- Added P1-T08/T09 design tasks; retained current phase and blockers.
- Product code unchanged. No plugins installed or runtime verification claimed in this update.

## 2026-11-15 — Initial implementation

- Added execution plan, agent instructions, state ledger, issue backlog, decisions, and verification guide.
- Added React/TypeScript participant workflow and Firebase device-only adapter.
- Added manual/sample flow, editable cards, explicit consent, exact preview, and local JSON export.
- Added dependency-free privacy/domain regression tests.
- Dependency installation blocked by npm registry DNS failure. Build, browser UI, real AI, and network audit remain unverified.
- Verification: `npm test` passed 6 of 6 tests on Node 22.14.0. Actual `npm install` attempted and failed with ENOTFOUND for the npm registry.


## Explicit development App Check token

- Added VITE_APPCHECK_DEBUG_TOKEN support inside the development/debug guard; blank retains generated-token behavior.
- Replaced dynamic environment lookup with explicit configuration fields so Vite does not embed the entire environment object. Production build checked: configured debug token absent.
- Build and seven tests passed. Firebase Console showed new token row still awaiting Save; fresh authorization verification pending after save/reload. No token value recorded.


## App Check authorization verified

- Fresh reload with explicit development token: exchangeDebugToken HTTP 200 and local model ready in Chrome. QN-002 resolved for local development. Token/response body not recorded; full privacy audit pending.


## P1 participant review and actual model evaluation

- Approved snapshot now drives readable preview and JSON download; JSON is in a disclosure. Added native populated-session clear dialog and focus recovery. Compact intro and semantic palette/44 px buttons.
- Browser verified readable preview, focused Keep editing, Escape preservation and focus return. Initial mobile section inspected at 390 px.
- Added development-only synthetic evaluation runner and 30-case fixture. Actual first-run results saved and reviewed: 30/30 source/schema, 20 semantic pass, 6 revisions, 4 failures. Subsequent prompt refinement built but awaits rerun.
- Build now checks production output excludes configured debug token and evaluation runner. Build and 7 tests pass.
- User requested Ponytail installation during browser work: marketplace added, ponytail@ponytail 5.3.3 verified installed/enabled.


## Evaluation follow-up and participant verification

- Second and third 30-case device runs saved as distinct artifacts. Source/schema 30/30 each; semantic R2 28 pass/1 revision/1 fail, R3 27/1/2. QN-014 records unresolved model errors.
- Refined prompt for categories, empty/conditional/uncertain inputs and private clarification. Build and seven tests pass after final prompt change.
- Browser keyboard approval/preview/disclosure/download verified; actual export bytes match approved snapshot. Confirmed clear removes session and restores note focus.
- Local storage empty; session storage extension diagnostics lack canary; SDK IndexedDB schema inspected. Full privacy gate remains open. Preparation/empty layouts inspected at 390/768/1440 after zoom reset.
- Ponytail review report saved; no cloud inference, phase transition, deployment or new sharing feature.


## System-message comparison and session-context correction

- Development evaluator supports a targeted/full system-message comparison. Targeted E18/E22 passed; full 30-case result 27 semantic pass/2 revision/1 fail. Evidence retained; experiment not promoted.
- Corrected clear after AI preparation to reload document and end retained SDK context. Confirmation explains restart and memory limits. Chrome verified blank state and re-preparation requirement.
- Strengthened review copy to call out invented details and unsupported promises.
- Final typecheck/build, production token/evaluator-exclusion check, seven tests passed. No phase advancement or deployment.


## GitHub workflow recovery

- Audited local/remote Git state: only initial .gitignore was committed; corrected by preparing P1 baseline on feat/p1-private-participant-slice.
- Added root readme/instructions/contributor guide, PR template and SHA-pinned read-only GitHub Actions CI (Node 22.14.0, npm ci, tests/build/production guard/audit).
- Staged secret/config/build-cache inspection passed; clean installation, seven tests and production build passed. Main protection absent; not changed or claimed.

- GitHub follow-up: committed P1 baseline e869e92, pushed task branch and opened draft PR #1 through authenticated gh after connector permission denial. Push and PR CI passed, along with GitGuardian. No merge, branch protection or deployment performed.


## Repository root layout

- Moved application source, package/lockfile, scripts, execution records and synthetic evaluation artifacts from docs/quietneeds-starter to repository root.
- Merged root README/agent/ignore instructions; updated CI and contribution paths. Moved ignored local environment intact. No feature or phase change.
- Root-layout verification: clean npm ci, seven tests and production build/privacy guards passed.
