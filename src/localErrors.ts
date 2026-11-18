export function localFailureMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : '';
  switch (code) {
    case 'INVALID_LOCAL_JSON': return 'The local model responded, but its response was not valid JSON. Edit manually or retry.';
    case 'INVALID_LOCAL_DRAFT': return 'The local model responded, but its draft did not meet the required format or limits. Edit manually or retry.';
    case 'UNVERIFIED_DRAFT_DETAILS': return 'The local draft could not be verified against your note. Add your requests manually or retry.';
    case 'TOO_MANY_REQUIREMENTS': return 'The card can hold up to eight requests. Remove a request or combine related details before adding this draft.';
    case 'UNEXPECTED_INFERENCE_SOURCE': return 'The response did not confirm on-device inference and was rejected. Use manual editing.';
    default: return 'Local generation could not complete. Check device readiness, edit manually, or retry. Cloud fallback is disabled.';
  }
}
