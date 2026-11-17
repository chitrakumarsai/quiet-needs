// Development-only evaluation tool. Never enter participant data here.
import { initializeLocalAi, extractLocally } from './localAi.ts';
import { localFailureMessage } from './localErrors.ts';
import type { Draft } from './domain.ts';
import { buildPrivatePrompt, draftResponseSchema, parseDraft } from './domain.ts';
import { getApps } from 'firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode, InferenceSource } from 'firebase/ai';
import './style.css';

type Case = { id: string; scenario: string; note: string; reviewCriteria: string };
const root = document.getElementById('evaluation')!;
if (!import.meta.env.DEV) {
  root.textContent = 'Synthetic evaluation is available only in development.';
} else {
  const params = new URLSearchParams(location.search);
  const scopeExperiment = params.get('experiment') === 'scope';
  const systemExperiment = scopeExperiment || params.get('experiment') === 'system';
  const targetIds = ['QN-E18', 'QN-E22'];
  if (params.get('scope') === 'target' || scopeExperiment) targetIds.push('QN-E02', 'QN-E05', 'QN-E30');
  const title = document.createElement('h1'); title.textContent = 'Synthetic extraction evaluation';
  const warning = document.createElement('p'); warning.textContent = 'Development tool: runs the 30 repository-owned fictional cases on this device. No participant data. Results stay in memory until explicitly downloaded. Schema success is not a semantic quality score.';
  const fullSystemRun = systemExperiment && !scopeExperiment && params.get('scope') === 'all';
  const run = document.createElement('button'); run.textContent = systemExperiment && !fullSystemRun ? `Run ${targetIds.length} targeted cases on device` : 'Run 30 synthetic cases on device';
  const status = document.createElement('p'); status.setAttribute('role', 'status');
  const output = document.createElement('ol');
  const download = document.createElement('button'); download.textContent = 'Download synthetic results'; download.disabled = true;
  const results: { id: string; scenario: string; reviewCriteria: string; source: string; draft?: Draft; error?: string; semanticReview: string }[] = [];
  root.append(title, warning, run, status, output, download);
  run.onclick = async () => {
    run.disabled = true; download.disabled = true; results.length = 0; output.replaceChildren();
    try {
      status.textContent = 'Preparing device model…';
      await initializeLocalAi(p => { status.textContent = `Preparing device model: ${p}%`; });
      let instructions = buildPrivatePrompt('SYNTHETIC').split('PRIVATE_NOTE_JSON:')[0];
      if (scopeExperiment) instructions += 'When a stated barrier prevents joining a named activity, request the least specific adjustment that preserves participation. Do not turn the barrier into a request to skip the activity. Keep every limit attached to its original subject: a materials budget applies to materials, and a personal attendance window applies to that participant.\n';
      const experimentModel = systemExperiment ? getGenerativeModel(getAI(getApps()[0], { backend: new GoogleAIBackend() }), {
        mode: InferenceMode.ONLY_ON_DEVICE,
        onDeviceParams: {
          createOptions: { initialPrompts: [{ role: 'system', content: [{ type: 'text', value: instructions }] }] },
          promptOptions: { responseConstraint: draftResponseSchema },
        },
      }) : null;
      if (experimentModel) await experimentModel.initializeDeviceModel();
      const response = await fetch('/evaluation/synthetic-cases.json');
      if (!response.ok) throw new Error('CASES_UNAVAILABLE');
      const allCases: Case[] = await response.json();
      const cases = systemExperiment && !fullSystemRun ? allCases.filter(item => targetIds.includes(item.id)) : allCases;
      if (systemExperiment && !fullSystemRun && cases.length !== targetIds.length) throw new Error('CASES_UNAVAILABLE');
      for (const [index, item] of cases.entries()) {
        status.textContent = `Running ${index + 1}/${cases.length}: ${item.id}`;
        const row = document.createElement('li'); output.append(row);
        try {
          let draft: Draft;
          if (experimentModel) {
            const result = await experimentModel.generateContent(`PRIVATE_NOTE_JSON: ${JSON.stringify(item.note)}`);
            if (result.response.inferenceSource !== InferenceSource.ON_DEVICE) throw new Error('UNEXPECTED_INFERENCE_SOURCE');
            draft = parseDraft(JSON.parse(result.response.text()));
          } else draft = await extractLocally(item.note);
          results.push({ id: item.id, scenario: item.scenario, reviewCriteria: item.reviewCriteria, source: 'ON_DEVICE', draft, semanticReview: 'pending human review' });
          row.textContent = `${item.id} ${item.scenario}: ${JSON.stringify(draft)} | Review: ${item.reviewCriteria}`;
        } catch (error) {
          const message = localFailureMessage(error);
          results.push({ id: item.id, scenario: item.scenario, reviewCriteria: item.reviewCriteria, source: 'unverified', error: message, semanticReview: 'failed generation or validation' });
          row.textContent = `${item.id}: ${message}`;
        }
      }
      status.textContent = `Complete: ${results.length} actual runs; ${results.filter(r => r.draft).length} source/schema passes. Semantic review required.`;
      download.disabled = false;
    } catch { status.textContent = 'Evaluation could not initialize. Check local setup and retry.'; }
    finally { run.disabled = false; }
  };
  download.onclick = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ kind: 'synthetic-evaluation', experiment: scopeExperiment ? 'system-message-participation-scope' : systemExperiment ? 'system-message' : 'single-user-prompt', results }, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'quietneeds-synthetic-results.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
}
