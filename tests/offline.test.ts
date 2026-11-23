import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

test('the service worker serves only the installed shell and never stores runtime traffic', async () => {
  const origin = 'https://quietneeds.example';
  const paths = ['/index.html', '/app.html', '/static/js/index.12345678.js', '/static/css/index.12345678.css', '/static/font/inter-variable.12345678.woff2'];
  const installed: Request[] = [];
  const deleted: string[] = [];
  const cached = new Response('cached shell');
  const workspace = new Response('cached workspace');
  type Handler = (event: Record<string, unknown>) => void;
  const listeners: Record<string, Handler> = {};
  let online = true;
  const network = new Response('online shell');

  runInNewContext(
    `const cacheName = 'quietneeds-shell-test'; const assets = ${JSON.stringify(paths)};\n` +
      readFileSync(new URL('../scripts/offline-worker.js', import.meta.url), 'utf8'),
    {
      self: {
        location: { origin }, clients: { claim: async () => {} },
        addEventListener: (name: string, handler: Handler) => { listeners[name] = handler; },
      },
      caches: {
        open: async () => ({
          addAll: async (requests: Request[]) => { installed.push(...requests); },
          match: async (path: string) => {
            assert.equal(typeof path, 'string');
            return path === '/app.html' ? workspace : paths.includes(path) ? cached : undefined;
          },
        }),
        keys: async () => ['quietneeds-shell-old', 'quietneeds-shell-test', 'another-app'],
        delete: async (name: string) => { deleted.push(name); },
      },
      URL, Request, Response,
      fetch: async () => { if (!online) throw new Error('offline'); return network; },
    },
  );

  let response: Promise<Response> | undefined;
  const respondWith = (promise: Promise<Response>) => { response = promise; };
  for (const event of ['install', 'activate']) {
    listeners[event]({ waitUntil: respondWith });
    await response;
  }
  assert.deepEqual(installed.map(request => request.url), paths.map(path => origin + path));
  assert.ok(installed.every(request => request.credentials === 'omit' && request.redirect === 'error'));
  assert.deepEqual(deleted, ['quietneeds-shell-old']);

  function request(url: string, mode = 'cors', method = 'GET') {
    response = undefined;
    listeners.fetch({ request: { url, mode, method }, respondWith });
    return response;
  }

  assert.equal(await request(origin + '/', 'navigate'), network);
  online = false;
  assert.equal(await request(origin + '/?event=fictional', 'navigate'), cached);
  assert.equal(await request(origin + '/card', 'navigate'), workspace);
  assert.equal(await request(origin + '/events/new', 'navigate'), workspace);
  assert.equal(await request(origin + '/join?event=fictional', 'navigate'), workspace);
  assert.equal(await request(origin + paths[2]), cached);
  assert.equal(await request(origin + paths[4], 'cors'), cached);
  assert.equal(request(origin + '/event-data'), undefined);
  assert.equal(request(origin + '/evaluation.html', 'navigate'), undefined);
  assert.equal(request(origin + paths[2] + '?private=canary'), undefined);
  assert.equal(request(origin + '/', 'navigate', 'POST'), undefined);
  assert.equal(request('https://firestore.googleapis.com/listen'), undefined);
});
