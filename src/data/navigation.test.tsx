import { describe, expect, it } from 'vitest';
import { ROUTES } from '@/app/routes';
import { Home } from '@/pages/home/Home';
import { renderWithProviders } from '@/test/utils';
import { collectNavLinks, isLeafActive } from './navigation';

const PUBLIC_PATHS = new Set<string>(Object.values(ROUTES).filter((path) => path !== ROUTES.admin));

describe('integritas navigasi', () => {
  const links = collectNavLinks();

  it('semua tautan menuju halaman yang ada', () => {
    for (const link of links) {
      const [path = ''] = link.to.split('#');
      expect(PUBLIC_PATHS.has(path), `${link.label} -> ${link.to}`).toBe(true);
    }
  });

  it('semua tautan anchor punya target di beranda', () => {
    const { container } = renderWithProviders(<Home />);
    const anchors = links.filter((link) => link.to.includes('#')).map((link) => link.to.split('#')[1] ?? '');
    expect(anchors.length).toBeGreaterThan(0);
    for (const id of anchors) {
      expect(container.querySelector(`#${id}`), `#${id}`).not.toBeNull();
    }
  });

  it('menandai halaman aktif, termasuk subhalaman', () => {
    expect(isLeafActive({ label: 'Galeri', to: ROUTES.gallery }, '/galeri/abc')).toBe(true);
    expect(isLeafActive({ label: 'Galeri', to: ROUTES.gallery }, '/berita')).toBe(false);
    expect(isLeafActive({ label: 'Profil', to: '/#profil' }, '/')).toBe(false);
  });
});
