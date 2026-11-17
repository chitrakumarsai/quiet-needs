# Verification plan

## Automated checks

Run `npm test` using Node 22.14+; it requires no downloaded packages. These tests verify approval gating, export field allowlisting, immutable approved snapshots, malformed response rejection, clarification-only handling, prompt data delimiting, and a static device-only adapter guard.

After dependency installation run `npm run build` for TypeScript and Vite. These checks do not establish model quality, actual network privacy, or browser usability.

## Browser smoke checklist

1. Open the app without Firebase config. Manual editing works; local AI setup is disabled.
2. Load the fictional example. Status explicitly says this is not AI output.
3. Add, edit, and remove requests. Empty requests cannot be exported.
4. Approve and preview. The displayed JSON matches the downloaded JSON.
5. Edit any request after approval. Checkbox resets, preview disappears, export requires reapproval.
6. Change the private note. The old draft and approval are invalidated.
7. Uncheck approval. Preview disappears.
8. Clear session. Notes, requests, questions, and preview disappear.
9. Reload. No private session state returns. Downloaded files remain; this is explicitly explained.
10. Test keyboard navigation, visible focus, labels, status announcements, 200% zoom, and narrow viewport.

## Real local inference

Configure Firebase/App Check and supported Chrome using the execution plan. Initialize on click. Test with synthetic notes. Verify ON_DEVICE from the SDK, not a hard-coded UI label. Disable the network after initialization and try a new note. Record browser/SDK versions and redacted outcome only. Simulate model unavailable: manual editing must work without cloud retries.

## Network privacy audit — must pass before real private data

1. Use a unique synthetic canary such as PRIVATE_CANARY_QN_A17 in a private note.
2. Inspect browser Network traffic across initialization, generation, approval, export, errors, and retry. Firebase/App Check setup traffic may exist; the note and canary must not appear in any outgoing URL, body, headers, websocket payload, telemetry, or error report.
3. Check browser storage for raw notes; P1 intentionally stores no session data there.
4. Simulate malformed model output and network loss; verify neither triggers cloud inference.
5. Inspect export: canary must not be included as a hidden field. If AI places private details in request text, record the extraction failure and remove it during review; do not call this automatic anonymization.
6. In P2/P3 repeat using intercepted requests and two authenticated user contexts, including malicious attempts to read/write another user's card.
7. Add automated browser request assertions once the real integration can run. Keep synthetic data only in saved traces.

## Model evaluation

Prepare 30 synthetic cases and expected constraints. Include explicit/absent times, amounts, negation, uncertain facts, conflicting preferences, private diagnoses or family reasons, and prompt injection. Measure critical detail invention, sensitive-reason leakage, valid schema rate, and clarification usefulness. Report actual counts; no invented benchmark results.

## P3 organizer checks

Cloud payload contains only approved cards and supplied event facts. Deterministic code checks time/budget constraints. Suggestions reference existing requirement IDs. Missing venue information stays unknown. Editing/withdrawing cards marks dependent plans stale. Participants confirm against a specific plan revision.


## Recorded run — November 15, 2026

- Node 22.14.0: domain tests 6/6, typecheck/build pass; npm audit zero findings.
- Native Chrome at http://127.0.0.1:5173/: AI controls disabled without configuration; sample labeled fictional; approval enables preview; preview excludes private clarification; edit hides preview and unchecks approval; approved empty request cannot preview; private-note change clears draft/consent; reload clears synthetic canary and session.
- Not run: downloaded-file byte comparison, full keyboard/200% zoom/responsive review, browser storage/network instrumentation, configured AI/offline inference. No full privacy audit pass claimed.
- Design gaps: JSON-only preview and immediate clear-session behavior (QN-012).


## Configured inference run — November 15, 2026

- Firebase 12.19.0; native desktop Chrome; exact Chrome version not recorded.
- Initial unconstrained synthetic extraction: source guard passed, JSON parsing failed. Fixed using onDeviceParams.promptOptions.responseConstraint with bounded draft schema.
- Online: “Please provide a chair for the fictional workshop.” → seating “Provide a chair”; private clarification “What type of chair is needed?”; UI success only after SDK ON_DEVICE check and parsing.
- With DevTools Network Throttling visibly Offline: “I need to leave the fictional workshop at 4 pm.” → timing “Departure at 16:00”; ON_DEVICE/validation passed. Clarification “Confirmation of workshop location needed.” was unnecessary; include in P1-T07 evaluation.
- Network panel showed an App Check request failing ERR_INTERNET_DISCONNECTED with 0 B transferred during offline check. Restored No throttling. This verifies simulated offline inference in an already-loaded app, not offline reload or whole-device network isolation.
- Online console showed App Check exchangeDebugToken HTTP 403; setup remains incomplete. Token redacted from observations; not stored in artifacts.
- Full canary traffic/storage audit and 30-case model evaluation still pending. Final build passes; tests 7/7 including safe diagnostic messages.

## P1-T06 canary and QN-012 review — November 15, 2026

- Readable approved preview verified in Chrome; private questions absent. Native clear dialog opens with Keep editing focused; Escape preserves draft/consent/preview and returns focus to Clear session.
- With PRIVATE_CANARY_QN_N15 in the note, initialization traffic was reCAPTCHA assets (App Check token already cached); Network Search returned no canary matches.
- Cleared network log with recording active before generation. Real device extraction completed; network log remained empty. This is a bounded observed run, not a complete traffic/storage/failure-path audit.
- Quality failure: output included “Chair provided.” (apparent commitment), “Participant presence.” and “Identifier protection.” despite only a chair being requested. Canary literal absent; one unnecessary seating-duration question. Record as failed semantic extraction, not successful quality evaluation.
- Prompt revised to require request wording, omit attendance/privacy instructions as requirements, and ask only necessary clarifications. Retest pending.

## Keyboard and downloaded export — November 15, 2026

- Actual participant flow: private canary typed, fictional sample loaded, Tab reached request editor, then removal/manual-add/consent controls in order. Space checked consent; Tab/Return opened preview; keyboard disclosure and download worked.
- Saved browser download evaluation/quietneeds-approved-card.json. Node comparison confirmed exact bytes equal JSON.stringify(makeApprovedCard(sampleDraft, true), null, 2). No private canary or clarification fields included.
- Clear confirmation: Keep editing initially focused; Tab reached destructive action; Return confirmed. Private note, requests, clarification and preview removed; consent unchecked; focus returned to note input.
- Calculated contrast: #183D36/white 11.93:1; #52665F/white 6.13:1; white/#20594B 8.10:1; white/#9B2929 7.66:1; muted/canvas 5.70:1. This covers these pairs, not every rendered state.


## Storage and responsive follow-up

- Typed PRIVATE_CANARY_QN_STORAGE in participant note. Local storage table: zero entries. Session storage: one extension diagnostic key with no canary. IndexedDB inventory showed Firebase App Check and heartbeat databases; inspected schema only to avoid capturing tokens. Full SDK record-content audit remains unverified.
- 768 and 1440 CSS-pixel viewports eventually applied; reset page zoom with focus in participant editor. Preparation/empty layout visually fit. At 390 px single-column preparation/empty state fit. Full populated-state overflow/200% audit remains open.
- Device emulation toggled during review; final participant tab retains emulation at 390 px/50% preview scale (normal network). No device/network permission changes.
- R2/R3 outputs and agent semantic review retained in evaluation/. Quality acceptance still fails on E18/E22.


## SDK context and system-message experiment

- Installed SDK source review: ChromeAdapterImpl.createSession creates a new session and destroys oldSession only on a subsequent generation; initializeDeviceModel does not clear the last prompt session. No public disposal API found.
- Added clear-and-restart after AI preparation. Chrome test: note populated, prepare succeeded, confirmation explained restart, confirm reloaded page. Note/draft/preview empty, consent unchecked, inference disabled until prepared again. This ends document context, not a secure OS memory-wipe guarantee.
- System-message targeted E18/E22 passed; full 30-case comparison retained in evaluation/quietneeds-system-full.json with semantic findings. Not promoted into production adapter.

## Synthetic canary and populated Chrome follow-up — November 18, 2026

- With Network recording and tab-local Offline enabled, entered a fictional note containing `PRIVATE_CANARY_QN_N18`. The cached model prepared and returned an ON_DEVICE seating draft. reCAPTCHA frame requests failed with `ERR_INTERNET_DISCONNECTED`. Network showed 0 B transferred and no matches for the marker.
- Restored No throttling and explicitly repeated the draft. The result passed the app's ON_DEVICE and schema checks. The recorded request count stayed at eight through the repeat. It was a repeat after successful offline generation, so app-level error recovery remains unverified.
- Reviewed installed Firebase storage code. The App Check store writes the token exchange result and the Firebase app store writes heartbeats. This explains the earlier store inventory. Browser record-content canary inspection, forced malformed output and controlled app-level failure/retry remain open.
- Visually inspected populated editor states at 390, 768 and 1440 CSS pixels. The 390 layout stacked panels and the two wider layouts showed both panels side by side. At actual Chrome 200% zoom the sample's expanded JSON wrapped and the download button was visible. These are visual spot checks of those states.
- With reduced motion emulated at 1440, Clear session focused Keep editing and Escape restored focus to Clear session while preserving the request. Restored normal network, default tab zoom and default motion emulation. Full design tooling and accessibility review are still open.
