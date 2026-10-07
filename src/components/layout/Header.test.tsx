import userEvent from '@testing-library/user-event';
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/utils';
import { Header } from './Header';

describe('Header', () => {
  it('membuka dan menutup dropdown dengan klik, Escape, dan klik di luar', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Navigasi utama' });
    const profil = within(nav).getByRole('button', { name: 'Profil' });
    const informasi = within(nav).getByRole('button', { name: 'Informasi' });

    expect(profil).toHaveAttribute('aria-expanded', 'false');
    await user.click(profil);
    expect(profil).toHaveAttribute('aria-expanded', 'true');
    expect(within(nav).getByRole('link', { name: /Visi & misi/ })).toHaveAttribute('href', '/#visi-misi');

    await user.keyboard('{Escape}');
    expect(profil).toHaveAttribute('aria-expanded', 'false');

    await user.click(profil);
    await user.click(informasi);
    expect(profil).toHaveAttribute('aria-expanded', 'false');
    expect(informasi).toHaveAttribute('aria-expanded', 'true');

    await user.click(document.body);
    expect(informasi).toHaveAttribute('aria-expanded', 'false');
  });

  it('menutup dropdown setelah tautan diklik', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Navigasi utama' });
    const trigger = within(nav).getByRole('button', { name: 'Informasi' });
    await user.click(trigger);
    await user.click(within(nav).getByRole('link', { name: /Berita/ }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('memuat semua tautan utama dan CTA PPDB', () => {
    renderWithProviders(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Navigasi utama' });
    for (const [name, href] of [
      ['Program', '/#program'],
      ['Akademik', '/akademik'],
      ['Galeri', '/galeri'],
      ['Kontak', '/kontak'],
    ] as const) {
      expect(within(nav).getByRole('link', { name })).toHaveAttribute('href', href);
    }
    expect(screen.getAllByRole('link', { name: 'Daftar PPDB' })[0]).toHaveAttribute('href', '/#ppdb');
  });

  it('membuka menu mobile dan menutupnya setelah memilih tautan', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    await user.click(screen.getByRole('button', { name: 'Buka menu' }));
    const dialog = screen.getByRole('dialog', { name: 'Menu navigasi', hidden: true });
    expect(dialog).toHaveAttribute('open');
    await user.click(within(dialog).getByRole('link', { name: 'Kontak', hidden: true }));
    expect(dialog).not.toHaveAttribute('open');
  });
});
