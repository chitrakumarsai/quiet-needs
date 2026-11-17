# Change log

## 2026-11-18 — Targeted P1 model and browser checks

- Added a development-only, five-case prompt comparison. Both batches passed source/schema checks. Semantic review found the candidate still misses seated participation and duplicates the scoped materials budget.
- Recorded synthetic Offline and online repeat evidence, populated responsive spot checks, approved JSON at 200% and reduced-motion dialog focus.
- Passed seven tests, production build and privacy guards. App-level failure/retry and browser storage record-content checks remain open.

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
