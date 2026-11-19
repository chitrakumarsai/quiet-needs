# Development workflow

Use feat/<task> or fix/<task> branches from current main. Preserve stable P0–P5 phase IDs and link changes to P1-Txx/QN-xxx records while P1 is active. STATE.md owns progress; BACKLOG.md owns task status and return points.

Before committing:

1. Run relevant tests and the production build from the repository root; use Node 22.14+ on Node 22.
2. Inspect git diff, git diff --cached and staged filenames. Check .env.local, debug tokens, caches and build output are excluded. Only synthetic evaluation artifacts may be committed.
3. Write a commit describing one coherent change. Update state/changelog/checkpoints with evidence when handing off.
4. Push the task branch and open a pull request. State the problem, resulting behavior, validation, and remaining gates. Use draft status while the change still needs implementation or verification.
5. Merge a verified change through its pull request after reviewing the source and CI results. A phase remains open until its product gate passes.

CI runs domain, extraction, and privacy tests, Firestore emulator rules, the production bundle and privacy checks, and npm audit. It uses a local demo Firebase project. Device inference, browser privacy, and model quality have separate evidence in TEST_PLAN.md and evaluation/RESULTS.md.

Branch protection is a GitHub setting, not enforced by this document. Verify required checks/rules independently; do not claim protection exists just because a workflow file exists. No auto-deployment or auto-merge is configured.

Do not post private notes, SDK debug tokens or real participant data in issues, pull requests, CI logs or artifacts. Keep provider/public web configuration distinct from secrets. Local .env.local is ignored.
