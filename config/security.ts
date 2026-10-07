export type HeaderMap = Record<string, string>;

const YOUTUBE_EMBED_ORIGIN = 'https://www.youtube-nocookie.com';
const YOUTUBE_THUMBNAIL_ORIGIN = 'https://i.ytimg.com';

const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';

export function buildContentSecurityPolicy(
  supabaseOrigin: string,
  target: 'header' | 'meta' = 'header',
): string {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'"],
    'img-src': ["'self'", 'blob:', supabaseOrigin, YOUTUBE_THUMBNAIL_ORIGIN],
    'font-src': ["'self'"],
    'connect-src': ["'self'", supabaseOrigin],
    'frame-src': [YOUTUBE_EMBED_ORIGIN],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
  };
  if (target === 'header') directives['frame-ancestors'] = ["'none'"];

  return Object.entries(directives)
    .map(([name, sources]) => [name, ...sources].join(' '))
    .join('; ');
}

export function buildSecurityHeaders(supabaseOrigin: string): HeaderMap {
  return {
    'Content-Security-Policy': buildContentSecurityPolicy(supabaseOrigin),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Strict-Transport-Security': 'max-age=31536000',
  };
}

export function toNetlifyHeaders(headers: HeaderMap): string {
  const lines = [
    '/*',
    ...Object.entries(headers).map(([name, value]) => `  ${name}: ${value}`),
    '',
    '/assets/*',
    `  Cache-Control: ${IMMUTABLE_CACHE_CONTROL}`,
    '',
  ];
  return lines.join('\n');
}

export function toApacheConfig(headers: HeaderMap): string {
  const securityLines = Object.entries(headers).map(
    ([name, value]) => `  Header always set ${name} "${value.replaceAll('"', '\\"')}"`,
  );
  return [
    '<IfModule mod_headers.c>',
    ...securityLines,
    '  <FilesMatch "\\.(js|css|woff2|webp)$">',
    `    Header set Cache-Control "${IMMUTABLE_CACHE_CONTROL}"`,
    '  </FilesMatch>',
    '</IfModule>',
    '',
    '<IfModule mod_rewrite.c>',
    '  RewriteEngine On',
    '  RewriteRule ^index\\.html$ - [L]',
    '  RewriteCond %{REQUEST_FILENAME} !-f',
    '  RewriteCond %{REQUEST_FILENAME} !-d',
    '  RewriteRule . /index.html [L]',
    '</IfModule>',
    '',
  ].join('\n');
}

export function toVercelConfig(headers: HeaderMap) {
  return {
    rewrites: [{ source: '/(.*)', destination: '/index.html' }],
    headers: [
      {
        source: '/(.*)',
        headers: Object.entries(headers).map(([key, value]) => ({ key, value })),
      },
      {
        source: '/assets/(.*)',
        headers: [{ key: 'Cache-Control', value: IMMUTABLE_CACHE_CONTROL }],
      },
    ],
  };
}
