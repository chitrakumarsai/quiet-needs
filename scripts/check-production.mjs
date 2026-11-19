import { loadEnv } from '@rsbuild/core';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
const token = loadEnv({ mode: 'production', prefixes: ['VITE_'] }).rawPublicVars.VITE_APPCHECK_DEBUG_TOKEN?.trim();
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.name === 'evaluation.html' || entry.name === 'synthetic-cases.json') throw new Error('Production output contains development evaluation assets.');
    if (entry.isDirectory()) await scan(file);
    else if (/\.(js|html|map)$/.test(file)) {
      const content = await readFile(file, 'utf8');
      if (token && content.includes(token)) throw new Error('Production output contains the development App Check token.');
      if (content.includes('Run 30 synthetic cases on device')) throw new Error('Production output contains the development evaluation runner.');
      if (/PRIVATE_NOTE_JSON|Generate synthetic cloud proposal/.test(content)) {
        throw new Error('Production output contains a private extraction prompt or synthetic cloud runner.');
      }
    }
  }
}
await scan('dist');
console.log('Production privacy checks passed. Private extraction and evaluation are development-only.');
