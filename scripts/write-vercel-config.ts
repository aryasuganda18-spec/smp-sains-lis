import { writeFileSync } from 'node:fs';
import { loadEnv } from 'vite';
import { buildSecurityHeaders, toVercelConfig } from '../config/security.ts';

const { VITE_SUPABASE_URL } = loadEnv('production', process.cwd(), 'VITE_');
if (!VITE_SUPABASE_URL) throw new Error('VITE_SUPABASE_URL belum diisi di file .env');

const config = toVercelConfig(buildSecurityHeaders(new URL(VITE_SUPABASE_URL).origin));
writeFileSync('vercel.json', `${JSON.stringify(config, null, 2)}\n`);
