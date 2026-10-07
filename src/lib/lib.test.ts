import { describe, expect, it } from 'vitest';
import { toCsv } from './csv';
import { stripHtml, truncate } from './format';
import { fitWithin } from './image';
import { sanitizeArticleHtml } from './sanitize';
import { escapeLike, sanitizeSearchTerm } from './search';
import { isUuid, slugify } from './slug';
import { isValidPhone, normalizePhone, toWhatsAppId, whatsAppLink } from './whatsapp';
import { getYouTubeId, isHttpsUrl } from './youtube';

describe('whatsapp', () => {
  it('mengubah nomor lokal ke format internasional', () => {
    expect(toWhatsAppId('0812-3456-7890')).toBe('6281234567890');
    expect(toWhatsAppId('+62 812 3456 7890')).toBe('6281234567890');
  });
  it('memvalidasi nomor telepon', () => {
    expect(isValidPhone('0812 3456 7890')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('abc')).toBe(false);
    expect(normalizePhone(' +62 812-34 ')).toBe('+6281234');
  });
  it('meng-encode pesan pada tautan', () => {
    expect(whatsAppLink('62812', 'a b&c')).toBe('https://wa.me/62812?text=a%20b%26c');
  });
});

describe('youtube', () => {
  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ])('mengambil id dari %s', (url, id) => expect(getYouTubeId(url)).toBe(id));

  it('menolak tautan berbahaya atau bukan YouTube', () => {
    expect(getYouTubeId('javascript:alert(1)')).toBeNull();
    expect(getYouTubeId('https://evil.example/watch?v=dQw4w9WgXcQ')).toBeNull();
    expect(getYouTubeId('https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ')).toBeNull();
    expect(isHttpsUrl('http://example.com')).toBe(false);
    expect(isHttpsUrl('https://example.com')).toBe(true);
  });
});

describe('sanitizeArticleHtml', () => {
  it('membuang script, handler, dan gambar', () => {
    const dirty = '<p onclick="x()">Halo<script>alert(1)</script><img src=x onerror=alert(1)></p>';
    const clean = sanitizeArticleHtml(dirty);
    expect(clean).toBe('<p>Halo</p>');
  });
  it('memblokir tautan javascript: dan menambah rel pada tautan aman', () => {
    expect(sanitizeArticleHtml('<a href="javascript:alert(1)">x</a>')).not.toContain('javascript');
    const safe = sanitizeArticleHtml('<a href="https://example.com">x</a>');
    expect(safe).toContain('rel="noopener noreferrer nofollow"');
    expect(safe).toContain('target="_blank"');
  });
});

describe('csv', () => {
  it('menetralkan awalan rumus dan meng-escape kutip', () => {
    const csv = toCsv([['=SUM(A1)', 'a "b"', '+62']]);
    expect(csv).toContain(`"'=SUM(A1)"`);
    expect(csv).toContain('"a ""b"""');
    expect(csv).toContain(`"'+62"`);
  });
});

describe('slug dan format', () => {
  it('membuat slug tanpa aksen dan simbol', () => {
    expect(slugify('Juara 1 Olimpiade Sains — Kabupaten!')).toBe('juara-1-olimpiade-sains-kabupaten');
    expect(slugify('!!!')).toBe('');
  });
  it('mengenali UUID', () => {
    expect(isUuid('3f2b8c1e-5d4a-4b6f-9a1c-0e7d2f3a4b5c')).toBe(true);
    expect(isUuid('../../etc')).toBe(false);
  });
  it('merapikan teks', () => {
    expect(stripHtml('<p>Halo&nbsp;<b>dunia</b></p>')).toBe('Halo dunia');
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
  });
  it('mengecilkan gambar tanpa memperbesar', () => {
    expect(fitWithin(4000, 2000, 1600)).toEqual({ width: 1600, height: 800 });
    expect(fitWithin(800, 600, 1600)).toEqual({ width: 800, height: 600 });
  });
});

describe('search', () => {
  it('membuang karakter yang bisa merusak filter PostgREST', () => {
    expect(sanitizeSearchTerm('Budi, (x) <b>"y"</b>*')).toBe('Budi x byb');
    expect(sanitizeSearchTerm('  a'.repeat(50)).length).toBeLessThanOrEqual(60);
  });
  it('meng-escape wildcard LIKE', () => {
    expect(escapeLike('50%_a\\b')).toBe('50\\%\\_a\\\\b');
  });
});
