import { initializeApp } from 'firebase/app';
import { browserPopupRedirectResolver, browserSessionPersistence, connectAuthEmulator, GoogleAuthProvider,
  initializeAuth, signInAnonymously, signInWithPopup, signOut } from 'firebase/auth';

export const emulatorProject = 'demo-quietneeds';
export const sharingEmulator = typeof window !== 'undefined' &&
  import.meta.env.DEV && import.meta.env.VITE_SHARING_EMULATORS === 'true';
let services: ReturnType<typeof createServices> | undefined;

export function sharingConfigured(): boolean {
  return sharingEmulator || (import.meta.env.VITE_SHARING_ENABLED === 'true' &&
    !!import.meta.env.VITE_FIREBASE_PROJECT_ID && !!import.meta.env.VITE_FIREBASE_API_KEY &&
    !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN && !!import.meta.env.VITE_FIREBASE_APP_ID);
}

function createServices() {
  const app = initializeApp(sharingEmulator ? { projectId: emulatorProject, apiKey: 'demo-key', authDomain: 'localhost' } : {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }, 'quietneeds-sharing');
  const auth = initializeAuth(app, { persistence: browserSessionPersistence });
  if (sharingEmulator) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  }
  return { app, auth };
}

export function getIdentity() {
  if (!sharingConfigured()) throw new Error('SHARING_UNAVAILABLE');
  return services ??= createServices();
}

export function signIn() {
  const { auth } = getIdentity();
  return sharingEmulator ? signInAnonymously(auth) : signInWithPopup(auth, new GoogleAuthProvider(), browserPopupRedirectResolver);
}

export function endSession() {
  return signOut(getIdentity().auth);
}
