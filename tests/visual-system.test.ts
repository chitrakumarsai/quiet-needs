import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function rgb(hex: string) {
  return hex.slice(1).match(/../g)!.map(part => parseInt(part, 16));
}

function mix(a: number[], b: number[], weight: number) {
  return a.map((value, index) => value * weight + b[index] * (1 - weight));
}

function luminance(color: number[]) {
  const weights = [.2126, .7152, .0722];
  return color.reduce((sum, channel, index) => {
    const srgb = channel / 255;
    return sum + weights[index] * (srgb <= .04045 ? srgb / 12.92 : ((srgb + .055) / 1.055) ** 2.4);
  }, 0);
}

test('dark and light text, action, and focus tokens meet their contrast targets', () => {
  const css = readFileSync(new URL('../src/visual-system.css', import.meta.url), 'utf8');
  const themes = [...css.matchAll(/:root[^\{]*\{([^}]+)\}/g)];
  assert.equal(themes.length, 2);
  for (const [, block] of themes) {
    const colors = Object.fromEntries([...block.matchAll(/--([\w-]+): (#[0-9a-f]{6});/g)]
      .map(([, name, color]) => [name, rgb(color)]));
    const assertContrast = (foreground: number[], background: number[], minimum: number, pair: string) => {
      const levels = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      const ratio = (levels[0] + .05) / (levels[1] + .05);
      assert.ok(ratio >= minimum, `${pair} has ${ratio.toFixed(2)}:1 contrast`);
    };
    for (const surface of ['bg-base','bg-surface-1','bg-surface-2','bg-surface-3']) {
      for (const text of ['text-primary','text-secondary','text-tertiary','brand-accent','success','danger']) {
        assertContrast(colors[text], colors[surface], 4.5, `${text} on ${surface}`);
      }
      assertContrast(colors['control-border'], colors[surface], 3, `control border on ${surface}`);
    }
    for (const [text, surface] of [['on-solid','solid'], ['on-solid','solid-hover'], ['on-accent','brand-accent'],
      ['on-danger','danger'], ['disabled-text','disabled'], ['warning-text','warning']]) {
      assertContrast(colors[text], colors[surface], 4.5, `${text} on ${surface}`);
    }
    const glow = mix(colors['brand-accent'], colors['bg-base'], .12);
    assertContrast(mix(colors['text-primary'], glow, .6), glow, 3, 'hero gradient endpoint');
    assertContrast(colors['brand-accent'], mix(colors['brand-accent'], colors['bg-surface-2'], .12), 4.5, 'accent badge');
  }
});
