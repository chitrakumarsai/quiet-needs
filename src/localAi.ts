import { initializeApp, getApps } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode, InferenceSource } from 'firebase/ai';
import { buildPrivatePrompt, checkExtractedDraft, draftResponseSchema, parseDraft } from './domain.ts';
import type { Draft } from './domain.ts';

let model: ReturnType<typeof getGenerativeModel> | undefined;
let initialized = false;
export function isConfigured(): boolean {
  return [import.meta.env.VITE_FIREBASE_API_KEY, import.meta.env.VITE_FIREBASE_PROJECT_ID,
    import.meta.env.VITE_FIREBASE_APP_ID, import.meta.env.VITE_RECAPTCHA_SITE_KEY]
    .every(Boolean);
}
function getLocalModel() {
  if (model) return model;
  if (!isConfigured()) throw new Error('SETUP_REQUIRED');
  const app = getApps()[0] ?? initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  });
  if (import.meta.env.DEV && import.meta.env.VITE_APPCHECK_DEBUG === 'true') {
    (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string }).FIREBASE_APPCHECK_DEBUG_TOKEN =
      import.meta.env.VITE_APPCHECK_DEBUG_TOKEN?.trim() || true;
  }
  initializeAppCheck(app, { provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY), isTokenAutoRefreshEnabled: true });
  const ai = getAI(app, { backend: new GoogleAIBackend() });
  // Never change this to PREFER_ON_DEVICE: that permits uploading private notes on fallback.
  model = getGenerativeModel(ai, {
    mode: InferenceMode.ONLY_ON_DEVICE,
    onDeviceParams: { promptOptions: { responseConstraint: draftResponseSchema } },
  });
  return model;
}
// Called directly from a user click; no prompt is supplied during initialization.
export async function initializeLocalAi(progress: (percent: number) => void): Promise<void> {
  await getLocalModel().initializeDeviceModel(value => progress(Math.round(value * 100)));
  initialized = true;
}
export async function extractLocally(note: string, evaluationInstructions = ''): Promise<Draft> {
  if (!initialized) throw new Error('INITIALIZE_FIRST');
  const prompt = buildPrivatePrompt(note);
  const result = await getLocalModel().generateContent(import.meta.env.DEV && evaluationInstructions
    ? `${evaluationInstructions}\n${prompt}` : prompt).catch(() => {
    throw new Error('LOCAL_GENERATION_FAILED');
  });
  if (result.response.inferenceSource !== InferenceSource.ON_DEVICE) throw new Error('UNEXPECTED_INFERENCE_SOURCE');
  let value: unknown;
  try { value = JSON.parse(result.response.text()); }
  catch { throw new Error('INVALID_LOCAL_JSON'); }
  let draft: Draft;
  try { draft = parseDraft(value); }
  catch { throw new Error('INVALID_LOCAL_DRAFT'); }
  return checkExtractedDraft(draft, note);
}
