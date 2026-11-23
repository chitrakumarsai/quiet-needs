import type { AnimationItem } from 'lottie-web';
import { reducedMotion, watchMotionPreference } from './motion-settings.ts';

export function mountHeroAnimation() {
  const container = document.getElementById('hero-animation');
  const button = document.querySelector<HTMLButtonElement>('#hero-pause');
  if (!container || !button) return;

  let visible = false;
  let paused = true;
  let loading = false;
  let ready = false;
  let animation: AnimationItem | undefined;
  function sync() {
    const reduce = reducedMotion();
    const inView = visible && !document.hidden;
    container!.classList.toggle('art-ready', ready && !reduce);
    button!.hidden = reduce;
    if (animation) {
      if (inView && !reduce && !paused) animation.play();
      else animation.pause();
    } else if (inView && !reduce && !paused && !loading) {
      loading = true;
      button!.textContent = 'Loading illustration…';
      void import(/* webpackChunkName: "hero-lottie" */ 'lottie-web/build/player/lottie_light.js').then(({ default: lottie }) => {
        animation = lottie.loadAnimation({
          container: container!, renderer: 'svg', autoplay: false, loop: true,
          path: '/card-illustration-motion.json',
        });
        animation.addEventListener('DOMLoaded', () => {
          ready = true;
          button!.textContent = paused ? 'Play illustration' : 'Pause illustration';
          sync();
        });
        animation.addEventListener('data_failed', failed);
      }).catch(failed);
    }
  }

  function failed() {
    paused = true;
    button!.textContent = 'Illustration unavailable';
    button!.disabled = true;
  }

  button.addEventListener('click', () => {
    paused = !paused;
    button.textContent = paused ? (ready ? 'Resume illustration' : 'Play illustration') : (ready ? 'Pause illustration' : 'Loading illustration…');
    sync();
  });
  watchMotionPreference(sync);
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, { threshold: .25 }).observe(container.parentElement!);
  sync();
}
