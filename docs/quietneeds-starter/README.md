# QuietNeeds

**Develop with Codex CLI:** follow [CODEX_CLI.md](CODEX_CLI.md), then run `bash scripts/start-codex.sh` from this project. Installation/authentication remain pending in the creation environment.

Share what you need to participate—not the private story behind it.

Start with [QUIETNEEDS_EXECUTION_PLAN.md](QUIETNEEDS_EXECUTION_PLAN.md). Codex must read [AGENTS.md](AGENTS.md) and [STATE.md](STATE.md) before continuing.

[ARCHITECTURE.md](ARCHITECTURE.md) defines the target system, data model, permissions, AI boundaries, revisions, and recovery. The architecture review is a P1 gate before sharing implementation begins.

Plan v1.1 includes researched modern design tooling and the shared Managing Plan Drift guidance. [DESIGN.md](DESIGN.md) owns visual and interaction requirements; [CHECKPOINTS.md](CHECKPOINTS.md) owns recovery evidence. Design tooling is planned, not installed.

## First slice

Private preparation → editable requirement card → explicit approval → exact JSON preview → local export. Manual entry works without configured AI after dependencies are installed. The fictional example is labeled; it is not inference.

Real local inference is implemented through Firebase AI Logic ONLY_ON_DEVICE, but requires Firebase/App Check configuration and a supported Chrome model. Current local inference is verified, but App Check debug-token authorization still needs correction (QN-002). No cloud inference or organizer sharing is implemented yet.

## Start

Use Node 22.14+ on Node 22. Python and NumPy are not required.

```bash
npm install --cache .npm-cache
cp .env.example .env.local
npm test
npm run build
npm run dev
```

Use `npm ci --cache .npm-cache` after generating a lockfile. Fill .env.local only when enabling real AI; never commit it. See the execution plan for App Check setup and verification gates.

## Current limits

- Dependencies installed and lockfile generated; use Node 22.14+ and `npm ci --cache .npm-cache`.
- Production build and seven tests pass; real on-device extraction works online and with Chrome DevTools Offline. Full privacy/browser audits remain pending.
- Dependency audit passes with zero findings after a scoped gRPC override; Firestore runtime testing remains a P2 gate.
- Memory-only session; reload clears content. Exported files remain on disk.
- No anonymity guarantee or automatic sensitive-text sanitizer.
- No authentication, Firestore, cloud organizer adaptation, deployment, or full offline reload yet.
- Use synthetic data until TEST_PLAN.md's privacy audit passes.

## Resume with Codex

Paste the resume prompt from QUIETNEEDS_EXECUTION_PLAN.md. STATE.md owns live progress; do not treat the plan's creation snapshot as current status.
