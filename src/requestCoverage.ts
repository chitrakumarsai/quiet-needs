import { checkExtractedDraft } from './domain.ts';
import type { Draft } from './domain.ts';

export const requestEvidenceSchema = {
  type: 'object', additionalProperties: false,
  required: ['evidence'],
  properties: { evidence: { type: 'array', maxItems: 8, items: { type: 'string', minLength: 1, maxLength: 500 } } },
};

export const requestSourceIdSchema = {
  ...requestEvidenceSchema,
  properties: { evidence: { type: 'array', maxItems: 8, items: { type: 'integer', minimum: 1 } } },
};

export function requestSourcePassages(note: string): string[] {
  return note.split(/(?<=[.!?])\s+(?=[A-Z])|(?<=;)\s+|(?<=,)\s+(?=(?:and|but)\s+(?:please|let|I)\b)/).map(passage => passage.trim());
}

export function resolveRequestSourceIds(value: unknown, passages: string[]): string[] {
  if (!Array.isArray(value) || value.length > 8 || value.some((id, index) =>
    !Number.isInteger(id) || id < 1 || id > passages.length || id < value[index - 1])) {
    throw new Error('UNVERIFIED_DRAFT_DETAILS');
  }
  return value.map(id => passages[id - 1]);
}

export function parseRequestEvidence(value: unknown, note: string): string[] {
  if (!Array.isArray(value) || value.length > 8 || new Set(value).size !== value.length ||
      value.some(quote => typeof quote !== 'string' || !quote.trim() || quote.length > 500 || !note.includes(quote))) {
    throw new Error('UNVERIFIED_DRAFT_DETAILS');
  }
  return value;
}

// shortcut: counts and literal checks cannot establish that the model found every request or preserved its meaning.
export function checkRequestCoverage(draft: Draft, evidence: string[], note: string): Draft {
  const checked = checkExtractedDraft(draft, note);
  if (checked.requirements.length !== evidence.length) throw new Error('UNVERIFIED_DRAFT_DETAILS');
  checked.requirements.forEach((requirement, index) => {
    checkExtractedDraft({ requirements: [requirement], questions: [] }, evidence[index]);
  });
  return checked;
}
