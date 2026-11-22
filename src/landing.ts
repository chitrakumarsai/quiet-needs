import { eventCodePattern, eventPath } from './routes.ts';
import './style.css';
import './site.css';

const legacyInvite = new URLSearchParams(location.search).get('event');
if (legacyInvite && eventCodePattern.test(legacyInvite)) {
  location.replace(eventPath(legacyInvite));
}

try {
  const appearance = localStorage.getItem('quietneeds-appearance');
  if (appearance === 'light' || appearance === 'dark') document.documentElement.dataset.theme = appearance;
  const account = document.getElementById('site-account');
  // Anonymous public visits can render and navigate without loading Firebase.
  if (account && Object.keys(sessionStorage).some(key => key.startsWith('firebase:authUser:'))) {
    void import('./LandingAccount.tsx').then(module => module.mountLandingAccount(account));
  }
} catch { /* The public Sign in link and system theme still work. */ }
