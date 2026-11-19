# Verification plan

## Automated checks

Run `npm test` using Node 22.14+; it requires no downloaded packages. These tests verify approval gating, export field allowlisting, immutable approved snapshots, malformed response rejection, clarification-only handling, prompt data delimiting, and a static device-only adapter guard.

After dependency installation run `npm run build` for TypeScript, Rsbuild and artifact privacy checks. These checks do not establish model quality, actual network privacy, or browser usability.

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

Cloud payload contains approved active requests and organizer-supplied facts and agenda options. The app preserves the organizer's times and validates references. Unknowns and conflicts stay visible for review. Editing or withdrawing a card marks dependent plans stale. Participants confirm against a specific plan and card revision.

- Chrome, November 18: the development runner returned `IN_CLOUD` from the Firebase SDK with `gemini-3.5-flash-lite`. The proposal chose the seated alternative with R01/A01 as evidence, flagged R02 as conflicting, and marked R03 step-free access unknown. The withdrawn synthetic marker and user identifiers were excluded by the same allowlisted builder used in the organizer flow.
- Safari, November 19: two local demo sessions verified share approval, publish gating, exact agenda, participant confirmation, organizer feedback, and the stale state after withdrawal. Used event refresh to read publication on the participant tab and stale feedback on the organizer tab.
- Emulator, November 19: accepted a full three-slot plan and rejected an unsupported alternate, changed time, invented title, private extra field, stale inputs, and obsolete confirmation. Initial six-slot test exceeded the rule expression limit and led to the lower cap.
- Passed: 21 automated tests, emulator rules, TypeScript/build, production privacy scan, and dependency audit. Full browser request interception, independent organizer trials, and live hosted integration remain pending.


## P4 offline shell — November 19, 2026

- Safari loaded the production preview once. With the preview process stopped and no listener on the origin port, a normal reload reopened the workspace and cleared the prior draft. A fictional event URL opened the shell. A fresh preview, approval, and download worked while the server remained stopped. The downloaded JSON matched the expected approved request.
- The worker test checks allowlisted assets, versioned cache deletion, offline navigation fallback, and bypassing event/API requests, writes, and the evaluator.
- The Firestore test calls the actual event creation function. It confirms the event with the emulator and checks that a dropped connection yields an unavailable error.
- Browser verification covered the unreachable app origin. Browser/OS offline indicator behavior and hosted cache headers remain unverified.

## P4 focus and form recovery — November 19, 2026

- Safari inserted typed text into the new request, venue fact, and activity without a second field selection. Removing a request returned typing focus to the remaining field.
- An invalid time zone produced a correction example and retained the event title. An invalid agenda time range retained the activity and times. Corrected times appeared in the exact agenda review after refreshing event access.
- Source review covered target sizes, long content, field labels and names, keyboard focus, and live announcements. Full viewport, keyboard-only walkthrough, and write-failure fault injection from an active participant session remain open. [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md)

## P4 cross-role browser regression — November 19, 2026

- Safari used two independent Auth Emulator sessions. The participant previewed a fictional local-only marker, edited it out, shared a different approved request, and approved a separate replacement. Before the second approval, the original shared revision remained visible and the replacement action was absent. The organizer saw the replacement, published a fictional agenda, and the participant saw that agenda become stale after withdrawal.
- A temporary loopback harness counted markers in outgoing Fetch, XHR, WebSocket sends, and beacon calls without saving request bodies. The participant trace counted 2 auth calls, 63 Firestore read or listen calls, 4 commits, and 2 other calls. The local-only marker appeared in zero captured requests and zero resource URLs. Each distinct approved request appeared in one Firestore commit. The card writes held one request, one replacement request, and an empty requirements list for withdrawal.
- The local-only marker was absent from localStorage and sessionStorage. The audit origin reported one IndexedDB database and zero Cache Storage entries. IndexedDB record contents and browser-managed network metadata were outside this check.
- In a separate Chrome fixture, one real Firebase AI Logic request included the approved fictional text once and excluded the withdrawn text and both fictional account identifiers. Its payload keys were `agenda`, `agendaRevision`, `inputRevision`, `requirements`, `schemaVersion`, `timeZone`, and `venueFacts`. Each requirement had only `category`, `ref`, and `request`. Firebase reported `IN_CLOUD`. This exercised the shared cloud adapter with a fixed fixture rather than a hosted organizer sign-in.
- The populated participant preview in Safari and the populated organizer editor in Chrome fit in same-origin frames at 390, 768, and 1440 CSS pixels with no horizontal document overflow. Chrome reached Preview, opened the exact JSON disclosure, approved the card, and reached Download using Tab, Enter, and Space. At Chrome's reported 200% zoom, the populated organizer editor with an approved manual preview fit the 390 CSS-pixel frame, with Download and Save still available. The full event workflow with a screen reader remains open.

## P4 independent organizer trial

Send each organizer the [standalone trial HTML](evaluation/quietneeds-organizer-trial.html). Ask them to download it, open it in a browser, and work independently. They review the fictional requests and venue facts, consider the prepared proposal, choose an activity, and preview and approve it if ready. They can publish a practice agenda and inspect the simulated feedback for that revision. They answer the three feedback prompts and return `quietneeds-organizer-trial-results.json`. A reviewer who gets stuck can still submit the feedback.

Record whether they identify the conflict and unresolved entrance question, explain the evidence supporting their choice, review the exact preview, and find feedback for the published revision. Keep organizer names and private notes out of the results. This standalone exercise measures review comprehension and navigation. Hosted sign-in, live cloud generation, and real publication still need separate trial evidence.

Chrome smoke check: opened the HTML directly from disk, verified that changing an activity resets approval, published revision 1, opened its feedback, and downloaded the synthetic result.

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

## Forced local failures and browser storage — November 18, 2026

- Ran the real participant entry point in Chrome on the configured localhost origin. A temporary synthetic-only harness made the first SDK generation reject with a canary in the exception and made the second report ON_DEVICE with malformed JSON. After each error, the draft button became available again and the user-facing status offered manual entry or retry. The third explicit click used the unmodified Firebase implementation, returned ON_DEVICE and produced a valid draft. The original synthetic note stayed in the editor and the error statuses contained no marker.
- The browser reported zero new Resource Timing entries after setup during the three attempts. Chrome Network search found the marker only in the local test script that supplied it. No cloud inference, telemetry or retry request containing the marker was observed. No HAR or credentials were saved. WebSocket frame inspection and persistent regression automation were outside this run.
- After recovery, the harness scanned local and session storage plus three IndexedDB records across two origin databases. No matches were found. It emitted counts and booleans only. This covers origin storage, with Chrome's internal model and OS storage outside the inspection. Removed the temporary harness after the test.
- In a separate run on the regular participant entry point, the model prepared and drafted with a new fictional marker. DevTools recorded one local Vite development socket with no displayed message frames and zero secure sockets. This completes the observed P1 browser audit across the two runs. Persistent browser regression automation remains follow-up.
- With the focus change applied, Tab reached the request editor, Space approved the card and Enter opened the preview. A keyboard edit cleared approval and hid the preview. The 3 px focus color is 8.10:1 against white and 7.53:1 against the canvas. The editable control border is 3.63:1 against white and 3.37:1 against the canvas. The build and all seven tests passed.

## Final participant browser review

- Chrome retained the same fictional approved card and available download control at 390, 768 and 1440 CSS pixels. The 390 visual check showed stacked panels and readable disclosure and download controls. Prior visual checks covered the wider layouts.
- A keyboard pass approved the fictional draft and opened the preview and exact JSON. At Chrome 200% zoom, Tab reached Download approved card after the expanded JSON. Reset page zoom after the check.
- Under reduced-motion emulation, Clear session opened the confirmation and Keep editing preserved the approved card and consent. The earlier keyboard Escape check restored focus. Restored the motion preference and device emulation settings.

## Build migration regression

- Rsbuild 1.7.6 builds to `dist/`. TypeScript, seven tests, and npm audit passed. A synthetic App Check debug token was absent from the production assets, and production omitted the evaluation page and case fixtures.
- Chrome on the Rsbuild development server prepared the actual device model and drafted a fictional seating request. DevTools Offline then produced a second valid ON_DEVICE result for written instructions with no new requests in the recorded Network panel. Restored normal networking.
- Approval opened the exact preview and an edit cleared approval and hid the old preview. The developer-only evaluator completed both E18 and E22 on device.

## Selected-text recovery

- Prepared local AI in Chrome using a synthetic note with distinct chair and written-instructions requests. Created and approved an edited aisle-chair request, then used keyboard selection and activation to add only the written-instructions passage on device.
- The existing aisle-chair request stayed intact, the written-instructions request was added, and prior consent and preview cleared. After reapproval, the exact JSON contained both requests and no private-note marker.
- Checked that the recovery control wrapped and remained readable at 390 CSS pixels. Verified an unchanged working card on request overflow and duplicate handling through the automated tests.
- In a second synthetic note, selected the departure and materials-budget sentences individually. The first result requested a personal departure by 4 p.m. The next preserved that request and added the participant's 500 INR materials budget.

## Manual-entry P1 release verification

Chrome opened the production build and verified entering two requests, blocking preview for a blank request, displaying the exact requested text before approval, disabling download until approval, and clearing preview and consent after editing. The downloaded JSON matched the expected schema and both revised requests. Escape cancelled clearing and restored focus to Clear session. Confirming cleared the form and returned focus to the first request. Production inspection found no Firebase App Check host, model endpoint, private prompt, or evaluation runner. Historical device-only inference checks apply to the development evaluator.

## P2 local approved-sharing gate

- The Auth and Firestore emulators ran with the isolated `demo-quietneeds` project. Two separate Chrome tabs used distinct in-memory demo identities. The participant could submit a join request and could not see event content while pending. Organizer admission enabled event access. A preview alone exposed no sharing action. Approval enabled sharing, and the organizer saw the approved text after refresh.
- Verified replacement from revision 1 to 2, then participant withdrawal. Local edits cleared approval and kept the previous revision visibly shared until replacement. The organizer revoked access after a new share, which removed the card from their active list and ended participant access. A second browser run verified that server acknowledgement clears approval and requires a new preview and approval for any further share.
- Rules tests verified isolated events, anonymous and cross-user denial, pending members, unauthorized membership writes, card owner spoofing, extra card and requirement fields, blank and oversized requests, isolated revision changes, operation replay, concurrent revision contention, valid eight-request replacement, withdrawal, and atomic revocation. The test suite executed real transactions against the Firestore emulator.
- Passed: 19 automated domain/evaluation tests, the emulator rules suite, production TypeScript/build and privacy checks, and npm audit with zero findings.
- Pending: live Google sign-in and rules deployment to an isolated hosted project. The emulator browser run used synthetic local sign-in.
