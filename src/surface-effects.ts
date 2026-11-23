import { reducedMotion, watchMotionPreference } from './motion-settings.ts';

export function mountSurfaceEffects() {
  const header = document.querySelector('.site-header');
  const shot = document.querySelector<HTMLElement>('.product-shot');
  const canHover = matchMedia('(hover: hover) and (pointer: fine)');
  let frame = 0;
  let spotlightFrame = 0;
  let pointer: PointerEvent;

  function update() {
    frame = 0;
    header?.toggleAttribute('data-scrolled', scrollY > 4);
    if (shot) {
      const angle = canHover.matches && !reducedMotion() ? 3 * Math.max(0, 1 - scrollY / 420) : 0;
      shot.style.setProperty('--shot-tilt', angle + 'deg');
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  if (shot) watchMotionPreference(schedule);
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !canHover.matches || reducedMotion()) return;
    pointer = event;
    if (spotlightFrame) return;
    spotlightFrame = requestAnimationFrame(() => {
      spotlightFrame = 0;
      if (!(pointer.target instanceof Element)) return;
      const surface = pointer.target.closest<HTMLElement>('[data-spotlight], .workspace .panel');
      if (!surface) return;
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty('--spot-x', pointer.clientX - rect.left + 'px');
      surface.style.setProperty('--spot-y', pointer.clientY - rect.top + 'px');
    });
  }, { passive: true });
  schedule();
}
