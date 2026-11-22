import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { seconds } from '../src/motion-settings.ts';

test('shared durations keep their meaning when production CSS uses seconds', async () => {
  const css = await readFile(new URL('../src/motion.css', import.meta.url), 'utf8');
  const expected = { fast: .15, base: .25, slow: .4, route: .2, stagger: .06 };
  for (const [token, duration] of Object.entries(expected)) {
    const [, value] = css.match(new RegExp('--motion-' + token + ': ([^;]+)'))!;
    assert.equal(seconds(value), duration);
    assert.equal(seconds(' ' + duration + 's '), duration);
  }
  assert.equal(seconds('4s'), 4);
  assert.equal(seconds('4000ms'), 4);
});
