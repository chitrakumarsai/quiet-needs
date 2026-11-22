import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';

const index = await readFile('dist/index.html', 'utf8');
const app = await readFile('dist/app.html', 'utf8');
const worker = await readFile(new URL('./offline-worker.js', import.meta.url), 'utf8');
const assets = ['/index.html', '/app.html', '/card-illustration.svg', '/favicon.svg', ...(await readdir('dist/static', { recursive: true }))
  .filter(file => /^(?:js|css)\/(?:async\/)?[\w.-]+\.[a-f0-9]{8}\.(?:js|css)$/.test(file))
  .filter(file => !file.startsWith('js/async/hero-'))
  .sort().map(file => '/static/' + file)];

for (const [, asset] of (index + app).matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)) {
  if (!assets.includes(asset)) throw new Error('A shell entry point is missing from the offline build.');
}
if (!assets.some(asset => asset.endsWith('.js')) || !assets.some(asset => asset.endsWith('.css'))) {
  throw new Error('The offline build needs the app scripts and styles.');
}

const version = createHash('sha256').update(index).update(app).update(worker).update(assets.join('\n')).digest('hex').slice(0, 16);
await writeFile('dist/sw.js', `const cacheName = 'quietneeds-shell-${version}';\nconst assets = ${JSON.stringify(assets)};\n${worker}`);
