# QuietNeeds

QuietNeeds helps participants share practical requests for an event and see what the organizer can provide before they attend.

## Try the live demo

Open [QuietNeeds on Firebase Hosting](https://quietneeds-web.web.app/) in Chrome. You can write a card, review its exact wording, approve it, and download it without signing in. Use fictional requests in the demo.

Sign in with Google to create or join an event. Organizers admit participants, review their approved cards, and publish an agenda with private outcomes for each request. A participant can respond **Works for me** or **Still need help** on a linked activity. Organizers can plan manually or review the approved inputs and request a cloud proposal with Firebase AI Logic.

The [judge walkthrough](devpost-media/README.md#testing-instructions-for-judges) covers the two-account flow and the separate Chrome evaluator. [MIT License](LICENSE)

## On-device evaluator

The hosted participant flow uses manual entry. The development evaluator uses Firebase AI Logic with Gemini Nano 4 in desktop Chrome and requires on-device execution. It runs fictional cases and records the SDK-reported inference source. [Firebase and Chrome setup](QUIETNEEDS_EXECUTION_PLAN.md#4-firebase-and-browser-setup) · [Evaluator guide](evaluation/README.md) · [Saved results](evaluation/RESULTS.md)

## Start

Use Node 22.14+ on Node 22. Python and NumPy are not required.

```bash
npm ci --cache .npm-cache
npm test
npm run build
npm run dev
```

The committed lockfile supports `npm ci --cache .npm-cache`. The synthetic evaluator can use a private .env.local. See the execution plan for App Check setup.

Unshared drafts stay in the tab and clear on reload. Downloaded copies stay on disk. Once the app has cached its files, manual card creation and download work offline. Event actions require a connection. Review the exact text before approving a card or generating a cloud proposal.

## Repository workflow

Run the commands above from the repository root. CI runs tests, Firestore emulator rules, typechecking, production privacy checks, and a dependency audit. [Contributing](CONTRIBUTING.md) · [Architecture](ARCHITECTURE.md) · [Verification results](TEST_PLAN.md) · [Current project state](STATE.md) · [Codex CLI setup](CODEX_CLI.md)

## Verify offline reload

Run `npm run build` and `npm run preview` from the repository root. Open the preview once with a connection so the browser can cache the app files. Stop the preview server and reload normally. You can write, approve, and download a new manual card. A reload starts a fresh draft. Event actions require a connection and server acknowledgement.

The cache setup runs in production builds served over HTTPS or loopback. The development server stays uncached.

## Local sharing and planning demo

Use Java 21 or newer for Firestore and the pinned Firebase CLI for the demo emulators. Run these in separate terminals from the repository root.

```bash
npm exec --yes --package=firebase-tools@15.36.0 -- firebase emulators:start --only auth,firestore --project demo-quietneeds
VITE_SHARING_EMULATORS=true npm run dev
```

In two tabs, select **Start demo session** to create separate synthetic accounts. The organizer creates an event and shares its link. The participant opens it and requests admission. Once admitted, the participant previews and approves the manual card, then chooses **Share with organizer**. Refresh the event in the organizer tab to see the shared revision.

In **Plan the agenda**, save up to three agenda slots and three venue facts. Link an approved request to a planned activity or mark it **Still checking** or **Can’t provide**. Approve the exact preview and publish. The participant can respond **Works for me** or **Still need help** to a linked activity, and the organizer can refresh feedback. Replacing or withdrawing a card makes the current agenda stale.

To run the access rules against the same emulator, use `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run test:rules`. The suite clears data for `demo-quietneeds` before it runs.

For a hosted demo, configure the public Firebase web fields for an isolated Firebase project, enable Google sign-in and authorize the host domain, and deploy the checked-in Firestore rules before building with `VITE_SHARING_ENABLED=true`. The local emulator switch is development-only. Live Firebase setup and its provider sign-in have separate verification.

To publish a seven-day Hosting preview with manual planning, build with `VITE_SHARING_ENABLED=true VITE_PLANNER_CLOUD_ENABLED=false npm run build`, then run `npm exec --yes --package=firebase-tools@15.36.0 -- firebase hosting:channel:deploy p4-trial --expires 7d --project YOUR_DEMO_PROJECT`. Use fictional requests in the preview since it connects to the project's live Auth and Firestore. [Firebase Hosting preview channels](https://firebase.google.com/docs/hosting/test-preview-deploy)

With Firebase AI Logic and reCAPTCHA Enterprise App Check configured on that project, `VITE_PLANNER_CLOUD_ENABLED=true` adds cloud proposals to the organizer controls. Set `VITE_RECAPTCHA_SITE_KEY` to the registered score-based Enterprise site key. Preview approved requests and event facts before generating. The development-only check at `/evaluation.html?experiment=planner-cloud-smoke` uses a fixed fictional fixture against the configured cloud project.
