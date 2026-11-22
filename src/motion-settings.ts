const preferenceKey = 'quietneeds-reduce-motion';
const motionQuery = '(prefers-reduced-motion: reduce)';
const preferenceEvent = 'quietneeds-motion-change';

export function savedReducedMotion() {
  try { return localStorage.getItem(preferenceKey) === 'true'; }
  catch { return false; }
}

export function applyMotionPreference(reduce = savedReducedMotion()) {
  document.documentElement.dataset.motion = reduce ? 'reduce' : 'system';
}

export function setMotionPreference(reduce: boolean) {
  applyMotionPreference(reduce);
  try { localStorage.setItem(preferenceKey, String(reduce)); } catch { /* This page still respects the choice. */ }
  window.dispatchEvent(new Event(preferenceEvent));
}

export function reducedMotion() {
  return document.documentElement.dataset.motion === 'reduce' || matchMedia(motionQuery).matches;
}

export function watchMotionPreference(onChange: () => void) {
  const media = matchMedia(motionQuery);
  media.addEventListener('change', onChange);
  window.addEventListener(preferenceEvent, onChange);
  return () => {
    media.removeEventListener('change', onChange);
    window.removeEventListener(preferenceEvent, onChange);
  };
}

export function seconds(cssTime: string) {
  const value = cssTime.trim();
  return parseFloat(value) / (value.endsWith('ms') ? 1000 : 1);
}

export function componentTiming() {
  const tokens = getComputedStyle(document.documentElement);
  const read = (token: string) => tokens.getPropertyValue('--motion-' + token).trim();
  const bezier = (token: string) => read(token).match(/-?[\d.]+/g)!.map(Number) as [number, number, number, number];
  return {
    fast: seconds(read('fast')),
    base: seconds(read('base')),
    route: seconds(read('route')),
    travel: parseFloat(read('travel')),
    enter: bezier('enter'),
    exit: bezier('exit'),
    validation: read('validation'),
    spring: {
      type: 'spring' as const,
      stiffness: Number(read('stiffness')),
      damping: Number(read('damping')),
    },
  };
}
