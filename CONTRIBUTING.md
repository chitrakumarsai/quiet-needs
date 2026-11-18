# Development workflow

Use feat/<task> or fix/<task> branches from current main. Preserve stable P0–P5 phase IDs and link changes to P1-Txx/QN-xxx records while P1 is active. STATE.md owns progress; BACKLOG.md owns task status and return points.

Before committing:

1. Run relevant tests and the production build from the repository root; use Node 22.14+ on Node 22.
2. Inspect git diff, git diff --cached and staged filenames. Check .env.local, debug tokens, caches and build output are excluded. Only synthetic evaluation artifacts may be committed.
3. Write a commit describing one coherent change. Update state/changelog/checkpoints with evidence when handing off.
4. Push the task branch and open a draft pull request. State the problem, resulting behavior, validation and remaining gates. Keep draft status while P1 acceptance work remains.
5. Review the source and CI results before requesting merge. Do not merge an incomplete phase merely because CI passes. Main should be updated through reviewed pull requests.

The P1 checks workflow verifies the domain, extraction, and privacy tests, TypeScript, the Rsbuild production bundle, exclusion of a synthetic App Check debug-token canary and evaluation assets, and npm audit. It runs without real Firebase configuration. Device inference, network privacy and model quality require separate evidence in TEST_PLAN.md and evaluation/RESULTS.md.

Branch protection is a GitHub setting, not enforced by this document. Verify required checks/rules independently; do not claim protection exists just because a workflow file exists. No auto-deployment or auto-merge is configured.

Do not post private notes, SDK debug tokens or real participant data in issues, pull requests, CI logs or artifacts. Keep provider/public web configuration distinct from secrets. Local .env.local is ignored.
