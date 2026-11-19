import { createCloudProposal, syntheticCloudApp } from './organizerCloud.ts';
import { buildPlanningSnapshot } from './planning.ts';

export function renderPlannerCloudSmoke(root: HTMLElement) {
  const { input } = buildPlanningSnapshot({
    inputRevision: 3, agendaRevision: 2, timeZone: 'UTC',
    agenda: [{ id: 'S01', start: '10:00', end: '10:30', title: 'Standing gallery discussion',
      alternate: 'Seated gallery discussion', factId: 'A01' }],
    venueFacts: [{ id: 'A01', status: 'verified', statement: 'A chair is available in the discussion room.' }],
  }, [{
    ownerUid: 'synthetic-approved', status: 'approved', revision: 1, requirements: [
      { id: '1', category: 'other', request: 'Please let me sit for the full discussion.' },
      { id: '2', category: 'other', request: 'Please keep this same discussion standing-only with no seating.' },
      { id: '3', category: 'other', request: 'Please confirm whether a step-free entrance is available.' },
    ],
  }, {
    ownerUid: 'synthetic-withdrawn', status: 'withdrawn', revision: 2, requirements: [
      { id: '4', category: 'other', request: 'Withdrawn synthetic marker.' },
    ],
  }], ['synthetic-approved', 'synthetic-withdrawn']);
  const title = document.createElement('h1');
  const button = document.createElement('button');
  const preview = document.createElement('pre');
  const result = document.createElement('pre');
  title.textContent = 'Synthetic organizer cloud check';
  button.textContent = 'Generate synthetic cloud proposal';
  preview.textContent = JSON.stringify(input, null, 2);
  result.setAttribute('role', 'status');
  root.replaceChildren(title, button, result, preview);
  button.onclick = async () => {
    button.disabled = true;
    result.textContent = 'Waiting for Firebase AI Logic…';
    try {
      result.textContent = JSON.stringify(await createCloudProposal(syntheticCloudApp(), input), null, 2);
    } catch (error) {
      const safeStatus = error instanceof Error && error.message.match(/\b(?:HTTP|status(?: code)?:?)\s+(\d{3})\b/i)?.[1];
      const safeCode = error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' && /^[a-z-]+\/[a-z-]+$/.test(error.code) && error.code;
      const knownFailure = error instanceof Error && ['CLOUD_SOURCE_UNVERIFIED', 'INVALID_PROPOSAL', 'CLOUD_UNAVAILABLE'].includes(error.message) && error.message;
      result.textContent = [knownFailure || safeCode || 'Cloud request failed', safeStatus].filter(Boolean).join(' ');
    } finally {
      button.disabled = false;
    }
  };
}
