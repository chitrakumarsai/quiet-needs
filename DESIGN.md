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

The workspace refresh uses a compact wordmark and jump links, a serif task title, and a paper-like review surface beside the white request editor. An evergreen accent signals actions and focus, and a thin rule groups the event workspace. Creating and joining sit side by side on wide screens and stack in task order on narrow screens. The actual request editor and approved card provide the visual focus.

## Screen contracts

| Screen | Primary action | Necessary UX states |
| --- | --- | --- |
| Private preparation | Write practical requests | Empty, incomplete request, ready for preview |
| Card review | Edit practical requests | Empty request, valid draft, removed request, editing clears preview and approval |
| Sharing preview | Approve exact content | Audience shown, all outgoing user text visible, consent unchecked by default, local export clearly distinguished from actual sharing |
| Event sharing (P2) | Admit participants and share approved cards | Signed out, waiting for admission, active membership, approved card, replacement, withdrawal, revoked access |
| Organizer workspace (P3) | Review unmet requirements | No cards, new card, conflicting needs, missing venue facts, stale plan, proposed change |
| Revised plan (P3) | Confirm whether needs are met | Met, unmet, unknown, outdated revision, participant feedback |

In P1 the primary action is an approved local export, not “Send to organizer.” Only change that language when an authenticated sharing transport actually exists.

## Critical interactions

1. Do not ask for a diagnosis, identity characteristic, or justification. Ask what practical adjustment helps.
2. Ask for the action and any condition, place, time, or amount in the request editor.
3. Show preview and approval feedback in plain language.
4. Participant requests remain in tab memory until approved for local download.
5. Show a human-readable exact preview. Put JSON under an optional “Technical details” disclosure.
6. All edits invalidate prior approval and hide stale previews; this is a behavior contract, not optional polish.
7. Clearing a populated session uses a confirmation dialog with a clear destructive label; focus returns sensibly on cancellation.
8. Error messages state what happened and offer a next action. Preserve editable requests on recoverable failures.
9. Never claim “saved” for memory-only state. Explain refresh loss without alarming language.
10. Sharing copy distinguishes participants, organizer, and cloud processing. Do not imply anonymity.
11. Organizers preview approved requests before cloud generation. Label unresolved conflicts and unknowns, show the exact agenda before publication, and clear revision-specific approval and feedback when inputs change.
12. When the browser is offline, explain that event sharing needs a connection. Keep entry, review, and download available without changing their controls. Make the offline message available to screen readers.
13. Move focus into newly added request and agenda fields. Keep event codes and long requests within the screen width. Explain when a retry is needed and show the last confirmed shared revision during a temporary write failure.
14. Place proposal conflicts, requests needing more information, and unverified venue facts beside publish approval. Keep them in organizer view. Describe feedback as one participant’s whole-card response for the published revision.
15. Separate creating an event from opening an organizer's invite. Show the generated event code and link together and put join requests before agenda planning. Announce new requests and access changes in place.

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

## Verified workspace tools

- UI/UX Pro Max 2.15.0 was installed from the pinned npm installer's Codex templates. Only `ui-ux-pro-max` was copied from the temporary installer output. Its UX search ran under an isolated Python environment.
- Vercel's `web-design-guidelines` and `vercel-react-best-practices` were installed from `vercel-labs/agent-skills` at `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62`. To recreate the workspace install, use the Codex skill installer with that revision and the paths `skills/web-design-guidelines` and `skills/react-best-practices`, targeting `.agents/skills`.
- Codex app-server 0.169.0 returned all three workspace entries as enabled after a forced rescan. The selected installations are local and the version references are tracked. The participant screen keeps its verified native controls. See the execution plan for when a component library is appropriate.

## Recovering an omitted request

Once local AI is ready, the private explanation supports keyboard and pointer selection and an Add from selection action. Guidance asks participants to include any conditions in the selection. The action keeps the existing card in place and updates status through the existing live region. Before approving, participants check that the card includes each intended request and preserves who it applies to, amounts, timing, and conditions.

## P4 design comparison

All three previews use the same editor, exact card approval, and Firebase emulator workflows. The user selected C, Balanced Hybrid, for the release. The comparison controls and alternate visual treatments remain available in development.

| Direction | Palette and typography | Layout, graphics, and motion | Strength and tradeoff |
| --- | --- | --- | --- |
| A · Refined minimalism | White, ink, and oxblood. System sans with tightly set headings and 8/16/24/40 px spacing. | A split editorial sheet, separated by a fine rule. A restrained line illustration in the review empty state. Short focus, press, and reveal feedback. | The fastest to scan. The quiet palette puts more weight on spacing and typography. |
| B · Experimental premium | Midnight indigo with acid-lime actions and lavender type accents. Compact system sans with a large geometric title and 12/20/28/40 px spacing. | Wide dark stage with an original SVG showing a request moving through review to the participation card. Layered dark review surface with crisp outlines. A slightly longer one-time preview reveal. | The strongest visual identity. Dark surfaces and brighter accents draw more visual attention. |
| C · Balanced hybrid | Linen, moss, and evergreen. Georgia headlines, system sans controls, and 8/16/24/32 px spacing. | Paired editor and paper preview with an original illustration of two sheets meeting. Warm depth with short, directional feedback. | Keeps the workflow approachable while giving it a recognizable identity. Its softer surfaces are visually quieter than B. |

### Launch review priorities

| Priority | Finding | Change |
| --- | --- | --- |
| 1 | The path from entry to approval is easy to overlook on narrow screens. | Make the next action prominent and use the same reading order at every width. |
| 2 | Opening a preview removes its trigger and requires careful focus handling. | Preserve heading focus and make the exact card and next available action visually clear. |
| 3 | A plain loading line provides little context and can shift the sharing section as it mounts. | Reserve a panel at the anchor and use a labeled loading skeleton. |
| 4 | Event creation, joining, and sign-in compete for equal visual weight. | Give separate forms a consistent hierarchy and use action-specific pending feedback. |
| 5 | The review empty state is a generic box. | Use an original graphic that describes the card handoff in each direction. |
| 6 | The title, controls, and panels rely on similar positioning in every screen. | Give each direction a distinct typographic and layout system. |
| 7 | Hover and pressed controls feel similar. | Add brief press feedback without changing layout or covering focus. |
| 8 | The clear dialog appears abruptly. | Add a short entrance and preserve native dismissal and focus restoration. |
| 9 | Clicking Open event with an invalid code can leave focus on the submit button. | Move focus to the invalid field and keep the inline error associated with it. |
| 10 | Review and download completion rely on changes in button availability alone. | Announce download initiation and retain a distinct checked control state. |

The application has no chart or drag workflow. The previews use the real forms, lists, dialogs, and statuses for interaction testing.

## Routed workspace

Use evergreen `#20594b`, linen `#f6f5ef`, paper `#fffefa`, and terracotta `#9a4938`. Georgia display headings pair with system sans. The type scale is 56–80 px display, 40–56 px h1, 28–36 px h2, 20 px h3, 16 px body, and 14 px supporting copy. Use an 8 px spacing grid, 12 px surfaces, 8 px inputs, and 160 ms transitions. A dark palette retains the same hierarchy.

The public page introduces the card, the approval handoff, and the privacy boundary. The app keeps one tab-local card state across Card, Events, Create event, and Join. The event detail uses existing admission, sharing, planning, and feedback controls. Event metadata and membership discovery follow the existing Firebase schema and rules.
