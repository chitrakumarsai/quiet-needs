import { eventCodePattern, eventPath } from './routes.ts';
import { applyMotionPreference } from './motion-settings.ts';
import { restoreTheme } from './theme.ts';
import { mountCommandMenu } from './command-menu.ts';
import { mountSurfaceEffects } from './surface-effects.ts';
import './style.css';
import './site.css';
import './landing.css';

restoreTheme();
applyMotionPreference();
mountCommandMenu();
mountSurfaceEffects();

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('step-reveal');
      reveal.unobserve(entry.target);
    }
  }, { threshold: .15 });
  document.querySelectorAll('.landing-section').forEach(section => reveal.observe(section));

  void import(/* webpackChunkName: "hero-controller" */ './hero-animation.ts')
    .then(module => module.mountHeroAnimation()).catch(() => { /* Keep the illustration static. */ });
}

const exampleButton = document.querySelector<HTMLButtonElement>('[data-example-approve]');
const exampleStatus = document.querySelector<HTMLElement>('[data-example-status]');
if (exampleButton && exampleStatus) {
  exampleButton.addEventListener('click', () => {
    const approved = exampleButton.getAttribute('aria-pressed') !== 'true';
    exampleButton.setAttribute('aria-pressed', String(approved));
    exampleStatus.textContent = approved ? 'Example approved' : 'Ready to review';
    exampleStatus.classList.toggle('example-approved', approved);
  });
}

const legacyInvite = new URLSearchParams(location.search).get('event');
if (legacyInvite && eventCodePattern.test(legacyInvite)) location.replace(eventPath(legacyInvite));

try {
  const account = document.getElementById('site-account');
  // Anonymous visits can render and navigate without loading Firebase.
  if (account && Object.keys(sessionStorage).some(key => key.startsWith('firebase:authUser:'))) {
    void import('./LandingAccount.tsx').then(module => module.mountLandingAccount(account));
  }
} catch { /* The public account links are still available. */ }
