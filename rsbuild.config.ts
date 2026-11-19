import { defineConfig, loadEnv } from '@rsbuild/core';

export default defineConfig(({ command, envMode }) => {
  const development = command === 'dev';
  const { rawPublicVars } = loadEnv({ mode: envMode, prefixes: ['VITE_'] });
  const keys = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID', 'VITE_RECAPTCHA_SITE_KEY'];
  if (development) keys.push('VITE_APPCHECK_DEBUG', 'VITE_APPCHECK_DEBUG_TOKEN');

  return {
    server: {
      host: '127.0.0.1',
      port: 5173,
      publicDir: development ? [{ name: 'evaluation', copyOnBuild: false }] : false,
    },
    source: {
      entry: { index: './src/main.tsx', ...(development ? { evaluation: './src/evaluation.ts' } : {}) },
      define: development ? Object.fromEntries(keys.map(key => ['import.meta.env.' + key, JSON.stringify(rawPublicVars[key] ?? '')])) : {},
    },
    html: { template: ({ entryName }) => './' + entryName + '.html' },
  };
});
