# QuietNeeds agent instructions

Read STATE.md, QUIETNEEDS_EXECUTION_PLAN.md, ARCHITECTURE.md, CHECKPOINTS.md, DESIGN.md, and open BACKLOG.md blockers at the start of every session.

- Preserve the product promise and permanent P0–P5 phase IDs.
- One active implementation phase. Do not add nested subphases.
- Resume the next task in STATE.md; preserve unrelated edits.
- Before complex detours, append a checkpoint; record QN-###, parent task, owner, and exact return point. After 15 minutes without progress summarize evidence and the next bounded experiment.
- Never send private explanations to cloud inference, Firestore, logs, analytics, or error tracking.
- ONLY_ON_DEVICE is mandatory for private extraction. Manual entry is the fallback.
- Export/share only allowlisted approved fields. Human review is necessary even after schema validation.
- Every card edit invalidates prior consent and preview.
- Do not show example data as actual AI output or claim a model source without checking the SDK response.
- Keep .env.local and App Check debug tokens private. VITE variables are browser-visible.
- Use project-local Node dependencies and a lockfile. UI UX Pro Max may use isolated Python standard-library design scripts; it does not need NumPy or a Python application backend.
- Run checks relevant to changed behavior; record passed, failed, and blocked separately.
- Update STATE.md and CHANGELOG.md at handoff. Do not advance a phase without its gate evidence.
- Do not add features simply to use another framework, model, or platform.
- Treat DESIGN.md as the visual/interaction source of truth. Follow the planned design → implement → browser review → separate UX review sequence.
- Skills, component libraries, and MCP tools are distinct. Verify installation and discovery; do not claim they exist because the plan names them.
- Reuse available browser tools; do not install every skill collection. Privacy and consent contracts take precedence over aesthetic suggestions.
- Reconcile actual files, Git evidence when available, and test results before trusting a recovered state. Never invent commit hashes.
- Before P2, record the P1-T10 architecture review. Follow ARCHITECTURE.md for schemas, access boundaries, input revisions, and honest retention/cost limitations; do not confuse documented design with implemented enforcement.

## GitHub workflow

The application and execution records are at this repository root. Use task branches and reviewable commits. Inspect staged paths and private configuration before each commit. Keep .env.local, debug tokens, node_modules, caches, build output and real participant data out of Git. Do not make direct implementation commits to main. Passing CI does not establish product-phase completion. See CONTRIBUTING.md.
