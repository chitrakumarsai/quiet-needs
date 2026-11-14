# Participant change review

Method: Ponytail review skill, source and caller review of main.tsx, localAi.ts, domain.ts, localErrors.ts, evaluation.ts, production check, tests and application contracts. Expected load: one memory-only participant session, up to eight requirements; development evaluation is 30 sequential fictional cases.

What this change does: It shows readable approved requests from the same snapshot used for export. It asks before clearing populated sessions, restores focus, and constrains local model output with a JSON schema.

Should fix:

1. Model semantics still need measured acceptance (domain.ts / evaluation/RESULTS.md).
   - What this is: The model converts private notes into proposed adjustments.
   - Problem: The initial 30-case run included empty-note intent becoming a requirement and loss of a conditional alternative. Correct schema did not catch these errors.
   - Fix: Refine the bounded prompt, rerun actual cases, retain failures, require participant review.
   - If skipped: A participant could approve a misleading request without noticing it.

2. Full browser privacy and responsive coverage remains incomplete (TEST_PLAN.md).
   - What this is: Memory-only and network boundaries must match product copy.
   - Problem: Current evidence covers one generation capture and export, not every failure/storage path or all target widths.
   - Fix: Complete the documented browser matrix and record actual outcomes.
   - If skipped: The P1 gate would imply broader verification than performed.

Verdict: complete 1 and 2 before marking P1 complete.
Not checked: deployed environment, Firestore access rules, organizer sharing or cloud planning; these are not implemented in P1. No independent security sign-off claimed.
