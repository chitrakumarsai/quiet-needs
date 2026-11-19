# QuietNeeds

**Develop with Codex CLI:** follow [CODEX_CLI.md](CODEX_CLI.md), then run `bash scripts/start-codex.sh` from this project. Installation/authentication remain pending in the creation environment.

Share what you need to participate—not the private story behind it.

Start with [QUIETNEEDS_EXECUTION_PLAN.md](QUIETNEEDS_EXECUTION_PLAN.md). Codex must read [AGENTS.md](AGENTS.md) and [STATE.md](STATE.md) before continuing.

[ARCHITECTURE.md](ARCHITECTURE.md) defines the target system, data model, permissions, AI boundaries, revisions, and recovery. The architecture review is a P1 gate before sharing implementation begins.

Plan v1.1 includes researched modern design tooling and the shared Managing Plan Drift guidance. [DESIGN.md](DESIGN.md) owns visual and interaction requirements; [CHECKPOINTS.md](CHECKPOINTS.md) owns recovery evidence. Design tooling is planned, not installed.

## First slice

Write practical requests → preview the exact card → approve → download JSON. The P1 participant page works without Firebase credentials or model setup. Session content stays in the tab.

The development evaluator uses synthetic data to study device-only extraction. See [evaluation/README.md](evaluation/README.md) for evaluator setup and [evaluation/RESULTS.md](evaluation/RESULTS.md) for the results.

## Start

Use Node 22.14+ on Node 22. Python and NumPy are not required.

```bash
npm ci --cache .npm-cache
npm test
npm run build
npm run dev
```

The committed lockfile supports `npm ci --cache .npm-cache`. The synthetic evaluator can use a private .env.local. See the execution plan for App Check setup.

## Current limits

- Dependencies installed and lockfile generated; use Node 22.14+ and `npm ci --cache .npm-cache`.
- The production build contains the manual participant page and its local export. Device-only inference is part of the synthetic evaluator.
- Dependency audit passes with zero findings after a scoped gRPC override; Firestore runtime testing remains a P2 gate.
- Memory-only session; reload clears content. Exported files remain on disk.
- No anonymity guarantee or automatic sensitive-text sanitizer.
- No authentication, Firestore, cloud organizer adaptation, deployment, or full offline reload yet.
- Use synthetic data until TEST_PLAN.md's privacy audit passes.

## Resume with Codex

Paste the resume prompt from QUIETNEEDS_EXECUTION_PLAN.md. STATE.md owns live progress; do not treat the plan's creation snapshot as current status.

## Repository workflow

Run the commands above from the repository root. See [CONTRIBUTING.md](CONTRIBUTING.md). CI runs tests, typecheck/build, production privacy checks and dependency audit. Browser privacy and model semantics require the separate evidence in [TEST_PLAN.md](TEST_PLAN.md) and [evaluation/RESULTS.md](evaluation/RESULTS.md).

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

In **Plan the agenda**, save up to three agenda slots and three venue facts, choose activities, and approve the exact preview before publishing. The participant can respond **Meets my needs**, **Does not meet my needs**, or **I’m unsure**, and the organizer can refresh feedback. Replacing or withdrawing a shared card retires the current agenda.

To run the access rules against the same emulator, use `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run test:rules`. The suite clears data for `demo-quietneeds` before it runs.

For a hosted demo, configure the public Firebase web fields for an isolated Firebase project, enable Google sign-in and authorize the host domain, and deploy the checked-in Firestore rules before building with `VITE_SHARING_ENABLED=true`. The local emulator switch is development-only. Live Firebase setup and its provider sign-in have separate verification.

With Firebase AI Logic and App Check configured on that project, `VITE_PLANNER_CLOUD_ENABLED=true` adds cloud proposals to the organizer controls. Preview approved requests and event facts before generating. The development-only check at `/evaluation.html?experiment=planner-cloud-smoke` uses a fixed fictional fixture against the configured cloud project.
