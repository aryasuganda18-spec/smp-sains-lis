import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import {
  buildContentSecurityPolicy,
  buildSecurityHeaders,
  toApacheConfig,
  toNetlifyHeaders,
} from './config/security.ts';

const CSP_META_PLACEHOLDER = '<!--csp-meta-->';

function readEnv(mode: string) {
  const { VITE_SUPABASE_URL, VITE_BASE_PATH } = loadEnv(mode, process.cwd(), 'VITE_');
  if (!VITE_SUPABASE_URL) throw new Error('VITE_SUPABASE_URL belum diisi di file .env');
  return { supabaseOrigin: new URL(VITE_SUPABASE_URL).origin, basePath: VITE_BASE_PATH || '/' };
}

function securityFiles(supabaseOrigin: string): Plugin {
  const headers = buildSecurityHeaders(supabaseOrigin);
  const metaCsp = buildContentSecurityPolicy(supabaseOrigin, 'meta');

  return {
    name: 'smp-security-files',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler: (html) =>
        html.replace(
          CSP_META_PLACEHOLDER,
          `<meta http-equiv="Content-Security-Policy" content="${metaCsp}" />`,
        ),
    },
    generateBundle(_options, bundle) {
      this.emitFile({ type: 'asset', fileName: '_headers', source: toNetlifyHeaders(headers) });
      this.emitFile({ type: 'asset', fileName: '.htaccess', source: toApacheConfig(headers) });
      const indexHtml = bundle['index.html'];
      if (indexHtml?.type === 'asset') {
        this.emitFile({ type: 'asset', fileName: '404.html', source: indexHtml.source });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const { supabaseOrigin, basePath } = readEnv(mode);

  return {
    base: basePath,
    plugins: [react(), securityFiles(supabaseOrigin)],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    build: {
      sourcemap: false,
      assetsInlineLimit: 0,
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}', 'config/**/*.test.ts'],
      restoreMocks: true,
    },
  };
});
