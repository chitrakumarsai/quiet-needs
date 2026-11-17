# QuietNeeds design brief

Version 1.0 · November 15, 2026 IST · Planned direction, not completed UI

## Product feeling

Calm, capable, modern, and respectful. A participant should understand the next action and who can see their words. Privacy is expressed through precise copy, review, and control—not decorative shield icons or claims of anonymity.

## Visual system

| Token | Starting value | Use |
| --- | --- | --- |
| canvas | #F6F7F3 | Warm neutral application background |
| surface | #FFFFFF | Editing/review surfaces |
| text | #183D36 | Primary text |
| muted text | #52665F | Supporting copy; verify contrast at rendered size |
| primary | #20594B | Main action, selected navigation |
| accent surface | #E6EEDD | Subtle supporting emphasis |
| warning surface | #FFF4D6 | Needs confirmation / unknown status, with explicit text |
| border | #D9E1D8 | Surface separation, not sole focus indication |
| spacing | 4, 8, 12, 16, 24, 32, 48 px | Consistent rhythm |
| corner radius | 10 px controls; 16 px surfaces | Restrained rounding |
| type | Locally available system sans initially | Readable at 16 px body; local fonts optional later |
| motion | 120–180 ms opacity/position, when helpful | Respect prefers-reduced-motion |

These are candidate tokens, not verified contrast results. Validate normal text, placeholder, error, disabled, and focus states in the real interface. Do not fetch fonts or third-party decorative assets in the private entry flow unless the privacy and offline implications are reviewed.

## Layout and hierarchy

- Compact header: wordmark, event context, privacy/help entry.
- Participant task screen: short title, one-sentence explanation, clear sequence Prepare → Review → Approve.
- Desktop: editor and card preview side by side where this reduces context switching; limit reading width.
- Mobile: single column, explicit progress, inline validation, and a primary action that does not cover content or keyboard focus.
- Keep complex organizer controls out of participant screens.
- Avoid a large landing-page hero in the working interface; devote space to the task.

## Screen contracts

| Screen | Primary action | Necessary UX states |
| --- | --- | --- |
| Private preparation | Draft privately / write manually | Empty, model setup, real download progress if available, ready, processing, unavailable, failure |
| Card review | Edit practical requests | No requests, clarification needed, valid draft, removed request, edited draft invalidating approval |
| Sharing preview | Approve exact content | Audience shown, all outgoing user text visible, consent unchecked by default, local export clearly distinguished from actual sharing |
| Organizer workspace (P2/P3) | Review unmet requirements | No cards, new card, conflicting needs, missing venue facts, stale plan, proposed change |
| Revised plan (P3) | Confirm whether needs are met | Met, unmet, unknown, outdated revision, participant feedback |

In P1 the primary action is an approved local export, not “Send to organizer.” Only change that language when an authenticated sharing transport actually exists.

## Critical interactions

1. Do not ask for a diagnosis, identity characteristic, or justification. Ask what practical adjustment helps.
2. Model setup explains download and manual alternatives before processing a note.
3. Show plain-language processing status; report device/cloud source only when known.
4. Keep clarifications private. Participants add confirmed details to the requirement themselves.
5. Show a human-readable exact preview. Put JSON under an optional “Technical details” disclosure.
6. All edits invalidate prior approval and hide stale previews; this is a behavior contract, not optional polish.
7. Clearing a populated session uses a confirmation dialog with a clear destructive label; focus returns sensibly on cancellation.
8. Error messages state what happened and offer a next action. Preserve editable requests on recoverable failures.
9. Never claim “saved” for memory-only state. Explain refresh loss without alarming language.
10. Sharing copy distinguishes participants, organizer, and cloud processing. Do not imply anonymity.

## Component strategy

Use shadcn/ui for Button, Textarea, Label, Checkbox, Alert, Dialog, Badge, and Card where appropriate. Customize semantic tokens once; avoid repeated one-off colors and spacing. Preserve native semantics and test actual interactions. Introduce additional components only when a screen needs them.

CSS transitions are enough for the MVP. Do not add a large motion package for decorative animation. Use consistent simple icons only when they help recognition, accompanied by accessible names; never use color/icon alone for status.

## Review loop

1. Review existing structure and privacy behavior before redesigning.
2. Use UI UX Pro Max to refine this brief and identify missing states.
3. Implement a small participant screen and review at 390/768/1440 px.
4. Use available browser tooling; Playwright MCP is optional if equivalent capabilities exist.
5. Run selected Vercel web-design and React reviews separately from generation.
6. Resolve issues tied to the active phase, record deferred improvements, and checkpoint.

## Definition of done

- Participant can complete the flow with keyboard only.
- Visible focus, descriptive labels, readable errors, and logical headings.
- No clipping or horizontal overflow at target widths and 200% zoom.
- Actual contrast checks meet the project's WCAG AA target.
- Primary controls have a 44 px target-size goal; adjacent destructive actions are separated.
- Reduced motion works; no decorative animation delays task completion.
- Exact outgoing content is understandable without reading JSON.
- Fictional samples, unverified AI, and real processing are distinguishable.
- Screenshots/traces use synthetic content only.
- Three participant trials and two organizer trials are recorded when available; failures remain visible in the backlog.

## Scope control

This brief is part of execution-plan v1.1. Use P1-T08/P1-T09 for the participant design work, P2/P3 for later screens, and P4 for broader refinement. No new project phase is created for visual work. Do not alter the underlying privacy architecture to satisfy a design-tool suggestion.

## November 18 implementation review

- Keep the responsive panel layout and native controls for the current correction. UI UX Pro Max 2.15.0 ran from an isolated Python environment against the keyboard and responsive brief. The pinned installer lacks the earlier plan's `--dry-run` flag. It generated several skills in a temporary directory. Workspace discovery and a shadcn integration remain open.
- Unified keyboard focus on dark teal, strengthened editable control borders, associated the private-note hint with its field, and exposed the first-download and manual-entry choices before setup. Private fields request that the browser disable autocomplete, autocorrect, and spellcheck. Questions wrap at narrow widths.
- Separate source review against Vercel's Web Interface Guidelines covered labels, focus, keyboard controls, status, and long content. The Chrome keyboard check confirmed that editing revokes approval and hides the old preview. Full P1 acceptance still needs the design tooling decision and a responsive accessibility pass on the final screen. [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)
- The final participant browser pass covered the populated 390/768/1440 layouts, keyboard approval and disclosure, 200% zoom, and reduced-motion clear confirmation. Retain the verified native dialog, checkbox, and labeled controls for this screen. Workspace-level skill discovery remains open.
