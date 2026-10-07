import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildContentSecurityPolicy, buildSecurityHeaders, toVercelConfig } from './security.ts';

const ORIGIN = 'https://example.supabase.co';

describe('Content-Security-Policy', () => {
  const policy = buildContentSecurityPolicy(ORIGIN);

  it('tidak mengizinkan script atau style inline', () => {
    expect(policy).not.toContain('unsafe-inline');
    expect(policy).not.toContain('unsafe-eval');
    expect(policy).toContain("script-src 'self'");
  });

  it('hanya mengizinkan Supabase untuk koneksi dan gambar', () => {
    expect(policy).toContain(`connect-src 'self' ${ORIGIN}`);
    expect(policy).toContain(ORIGIN);
  });

  it('memasang frame-ancestors hanya pada header, bukan meta', () => {
    expect(policy).toContain("frame-ancestors 'none'");
    expect(buildContentSecurityPolicy(ORIGIN, 'meta')).not.toContain('frame-ancestors');
  });

  it('memblokir object dan membatasi frame ke YouTube nocookie', () => {
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain('frame-src https://www.youtube-nocookie.com');
  });
});

describe('vercel.json', () => {
  it('sama dengan hasil generator (jalankan npm run sync:vercel bila gagal)', () => {
    const origin = new URL(readFileSync('.env', 'utf8').match(/VITE_SUPABASE_URL=(\S+)/)?.[1] ?? '').origin;
    const expected = toVercelConfig(buildSecurityHeaders(origin));
    expect(JSON.parse(readFileSync('vercel.json', 'utf8'))).toEqual(expected);
  });
});
