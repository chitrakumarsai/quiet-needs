import { eventCodePattern, eventPath } from './routes.ts';
import { applyMotionPreference, reducedMotion } from './motion-settings.ts';
import './style.css';
import './site.css';

applyMotionPreference();
if ('IntersectionObserver' in window) {
  const steps = document.querySelectorAll('.how-grid li');
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!reducedMotion()) entry.target.classList.add('step-reveal');
      reveal.unobserve(entry.target);
    }
  }, { threshold: .25 });
  steps.forEach(step => reveal.observe(step));

  void import(/* webpackChunkName: "hero-controller" */ './hero-animation.ts')
    .then(module => module.mountHeroAnimation()).catch(() => { /* Keep the illustration static. */ });
}

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
