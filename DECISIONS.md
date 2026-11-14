# Decision log

## D-001 — Web first (2026-11-15)

Use React/TypeScript with Firebase AI Logic. One web workflow reduces delivery scope. Native mobile is deferred. No Python runtime is required; NumPy is not an environment manager.

## D-002 — Private inference fails closed (2026-11-15)

ONLY_ON_DEVICE for raw notes; unsupported devices receive manual entry. Reject silent cloud fallback even if it improves availability. Organizer cloud processing will accept approved cards only.

## D-003 — Memory-only first slice (2026-11-15)

Do not persist raw notes. Refresh clears the session. This avoids a draft-retention design before validation; opt-in local persistence remains P4. Exported files are outside session deletion.

## D-004 — Explicit privacy claims (2026-11-15)

Promise control over shared content, not anonymity. Structural allowlisting cannot remove sensitive information embedded in request text. Human review remains required.

## D-005 — Stable plan and honest retrieval (2026-11-15)

Keep permanent phase IDs and separate current state, issues, and decisions. The full Managing Plan Drift answer was unavailable; no recommendations are attributed to it beyond the visible original concern.

Update, November 15, 2026: the user's shared link made the full answer accessible in the browser. Plan v1.1 now incorporates checkpoint-before-detour, three control layers, 15-minute investigation review, and verified recovery. Existing filenames remain to avoid competing sources of truth.

## D-006 — Modern design workflow (2026-11-15)

User requested modern UI/UX and popular Codex-compatible tooling. Select UI UX Pro Max as primary design guidance, official OpenAI skills as the core catalog, selected Vercel reviews, and shadcn/ui primitives. Playwright/shadcn MCP are optional when equivalent tools already exist. Popularity is documented with dated approximate GitHub counts, not treated as proof of quality. Design tasks remain within P1/P2/P3/P4, with DESIGN.md as the source of truth. No installation or redesign is claimed in this documentation update.

## D-007 — Development-only Python exception (2026-11-15)

UI UX Pro Max's design-search scripts use Python's standard library. If used, isolate them in .venv-design; no NumPy or Python backend is added. This refines D-001 without changing the application architecture.

## D-008 — MVP cloud placement (2026-11-15)

Use organizer-client Firebase AI Logic for the bounded synthetic-data MVP. Keep private extraction separate and device-only. Firestore rules authorize event records; App Check is not organizer-role authorization for the AI endpoint. Client validation/rate limits are not a hard security/spending boundary. Revisit a trusted backend before broader production use. No billing is enabled by this decision.

## D-009 — Shared data and concurrency (2026-11-15)

Use organizer-approved enrollment, one current card per participant, and atomic card/inputRevision updates. Publishing and confirmation require current source revisions. Separate participant-visible agenda from organizer-only rationale and reference mappings. Card edits/withdrawal invalidate derived plans; deletion cannot retract prior views or provider requests. ARCHITECTURE.md is authoritative for these implementation targets.


## 2026-11-15 — Scoped dependency remediation

Override only @firebase/firestore’s @grpc/grpc-js dependency to 1.13.6, retaining Firebase 12.19.0 and its device-only AI API. Upstream fixes: https://github.com/advisories/GHSA-m9gg-hp2v-232j and https://github.com/advisories/GHSA-f596-whhp-79r4. Firestore declares ~1.9.0; this intentionally overrides that range. Current P1 does not use Firestore. Audit, build and domain tests pass; emulator/integration checks are required before relying on this override in P2. Revisit/remove when Firebase supplies a patched dependency range. Do not apply npm’s suggested Firebase 9 downgrade.

## SDK session memory on clear

Installed Firebase 12.19.0 keeps its last Chrome LanguageModel session in chromeAdapter.oldSession until the next generation, when it creates a new session then destroys the previous one. initializeDeviceModel only checks/downloads availability and does not clear that session. No public disposal API was found in installed declarations. Do not access private SDK fields or imply secure memory erasure. Bounded correction: when a participant clears after using local AI, clear app state and reload the document to discard its SDK references/session context, explaining the restart in the confirmation. Browser/OS memory erasure still cannot be guaranteed. Manual-only clearing can retain the current no-reload interaction. Implement and verify after active model evaluation completes so HMR does not invalidate the run.
