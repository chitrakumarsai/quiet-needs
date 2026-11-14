# QuietNeeds with Codex CLI

## Purpose and current status

Codex CLI is the primary development agent for this project. It edits and tests the local React/TypeScript code and maintains the execution records. The application's runtime AI remains Firebase AI Logic; Codex is not part of the participant's data path.

Current check: `codex` was not found on this execution shell's PATH. An npm registry lookup failed with ENOTFOUND, so CLI installation, authentication, and a real CLI session are not verified. The launch script below is prepared, not evidence of a successful CLI run.

## 1. Install and sign in from your macOS terminal

```bash
npm install -g @openai/codex
codex --version
codex login
```

Use the browser sign-in offered by Codex. Do not put passwords, API keys, or auth tokens in project files. If you use nvm, activate your chosen Node version before installing; its global tools may differ between Node versions. If installation fails, fix the reported network/PATH issue rather than using sudo or disabling security controls.

## 2. Enter the actual app directory

```bash
cd /Users/chitrakumarsai/Documents/Codex/2026-11-15/https-firebasehybridaihackathon-devpost-com-rules-https/quietneeds
```

If you extracted the starter somewhere else, use that directory instead. It must contain AGENTS.md, STATE.md, and package.json. Codex Desktop and CLI are separate entry points; using Desktop does not prove the terminal command is installed.

## 3. Start the prepared session

```bash
bash scripts/start-codex.sh
```

The launcher changes to the correct project directory and passes the stored kickoff prompt with workspace-write sandboxing and on-request approvals. It does not install tools, sign in, weaken permissions, or start a background agent. Inspect the active permissions in Codex before work; organizational policy may impose stricter restrictions.

Equivalent manual launch:

```bash
codex --sandbox workspace-write --ask-for-approval on-request
```

Then paste the contents of prompts/codex-kickoff.txt. Use the installed CLI's `codex --help` if its options differ; do not substitute unrestricted access flags.

## 4. First implementation session

The kickoff prompt asks Codex to:

1. Read AGENTS.md, STATE.md, the execution plan, CHECKPOINTS.md, DESIGN.md, and BACKLOG.md.
2. Reconcile existing code, Git state if present, and actual test evidence.
3. Resume P1-T01: install dependencies and produce a lockfile.
4. Run tests/build; fix real failures within P1-T02.
5. Continue independent P1 tasks, including the documented UI/UX setup, when dependencies allow.
6. Record Firebase account/browser setup as blocked if unavailable; never pretend inference ran.
7. Keep a checkpoint and exact next action at handoff.

Have Codex inspect and initialize Git if this is still an unversioned project. Before any commit, inspect staged files and confirm private configuration and caches are excluded. Keep the development baseline local; publishing a repository is a separate action.

## 5. Resume and review

From the same project directory:

```bash
# Choose the correct previous interactive session:
codex resume

# Or continue the most recent session when you know it is this project:
codex resume --last
```

After resuming, tell Codex:

```text
Reconcile STATE.md and the latest CHECKPOINTS.md entry with the actual
files, Git status if available, and test evidence. Report the current
phase/task, blocker, and exact next action. Resume that task; do not
reconstruct progress solely from conversation history.
```

For a separate review pass, start a new session and ask:

```text
Review the current QuietNeeds changes without editing files. Prioritize
private-data leakage, cloud fallback, consent invalidation, event access
controls if implemented, accessibility, and regressions. Cite file/line
locations and distinguish verified findings from hypotheses.
```

Do not run two editing sessions against the same files simultaneously. If a complex issue needs isolation, checkpoint and use a separate Git worktree after Git exists. Separate agents are optional; sequential implementation and review are enough initially.

## 6. Skills and MCP

Follow execution-plan section 11. Install only the selected design/review skills and missing MCP capabilities, verify discovery, and record versions. Use UI UX Pro Max for design direction, selected Vercel guidance for review, and available browser tooling for visual verification. Do not install entire catalogs or change Firebase hosting because a skill suggests another provider.

CLI-installed skills/MCP settings are not assumed to be available in Desktop or this chat without verification. Keep project requirements in AGENTS.md and DESIGN.md so all entry points share the same rules.

## 7. Session completion contract

Before ending a session, Codex must update STATE.md, CHANGELOG.md, and a checkpoint when appropriate. The final report includes changed behavior, checks actually run, remaining blockers, current phase/task, and next action. Six passing domain tests do not establish browser privacy or local AI availability.

Development prompts, source files, and terminal output may be processed by the coding service. Use synthetic participant notes during development; the app's local-only privacy promise does not mean Codex CLI is an offline coding model.

## Official references

Verified November 15, 2026:

- https://developers.openai.com/codex/cli
- https://developers.openai.com/codex/cli/reference
- https://developers.openai.com/codex/auth
