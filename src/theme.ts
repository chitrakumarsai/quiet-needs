export type Theme = 'system' | 'light' | 'dark';

const key = 'quietneeds-appearance';
const systemLight = matchMedia('(prefers-color-scheme: light)');
const changeEvent = 'quietneeds-theme-change';

export function currentTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  return value === 'light' || value === 'system' ? value : 'dark';
}

function applyTheme(value: Theme) {
  document.documentElement.dataset.theme = value;
  const palette = value === 'system' ? (systemLight.matches ? 'light' : 'dark') : value;
  document.documentElement.dataset.palette = palette;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette === 'light' ? '#f7f8f7' : '#08090a');
}

export function restoreTheme() {
  systemLight.addEventListener('change', () => {
    if (currentTheme() === 'system') applyTheme('system');
  });
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark' || saved === 'system') applyTheme(saved);
  } catch { /* Default to dark when storage is unavailable. */ }
}

export function setTheme(value: Theme) {
  applyTheme(value);
  try { localStorage.setItem(key, value); } catch { /* Apply the choice for this tab. */ }
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeTheme(onChange: () => void) {
  window.addEventListener(changeEvent, onChange);
  return () => window.removeEventListener(changeEvent, onChange);
}

export function toggleTheme() {
  const style = getComputedStyle(document.documentElement);
  setTheme(style.colorScheme === 'light' ? 'dark' : 'light');
}
