import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/utils';

const submitRegistration = vi.fn<(payload: unknown) => Promise<void>>();
vi.mock('@/lib/api/content', () => ({ submitRegistration: (payload: unknown) => submitRegistration(payload) }));

const { PpdbForm } = await import('./PpdbForm');

async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getAllByLabelText(/Nama lengkap/)[0] as HTMLElement, 'Budi Santoso');
  await user.type(screen.getAllByLabelText(/Nama lengkap/)[1] as HTMLElement, 'Siti Aminah');
  await user.type(screen.getByLabelText(/Nomor WhatsApp/), '081234567890');
}

describe('PpdbForm', () => {
  beforeEach(() => {
    submitRegistration.mockReset();
    submitRegistration.mockResolvedValue();
  });

  it('menampilkan pesan galat dan tidak mengirim saat data wajib kosong', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PpdbForm />);
    await user.click(screen.getByRole('button', { name: 'Kirim pendaftaran' }));
    expect(await screen.findByText(/Nama calon siswa minimal 2 huruf/)).toBeInTheDocument();
    expect(screen.getByText(/Nomor WhatsApp tidak valid/)).toBeInTheDocument();
    expect(submitRegistration).not.toHaveBeenCalled();
  });

  it('mengirim data valid lalu menampilkan konfirmasi dengan tautan WhatsApp', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PpdbForm />);
    await fillRequired(user);
    await user.click(screen.getByRole('button', { name: 'Kirim pendaftaran' }));

    expect(await screen.findByRole('heading', { name: /Terima kasih, Siti/ })).toBeInTheDocument();
    expect(submitRegistration).toHaveBeenCalledWith(
      expect.objectContaining({ student_name: 'Budi Santoso', parent_name: 'Siti Aminah', source: 'ppdb_form' }),
    );
    expect(screen.getByRole('link', { name: 'Konfirmasi lewat WhatsApp' }).getAttribute('href')).toContain('https://wa.me/');

    await user.click(screen.getByRole('button', { name: 'Daftarkan calon siswa lain' }));
    expect(screen.getByRole('button', { name: 'Kirim pendaftaran' })).toBeInTheDocument();
  });

  it('menampilkan galat dan mempertahankan isian saat pengiriman gagal', async () => {
    submitRegistration.mockRejectedValue(new Error('jaringan'));
    const user = userEvent.setup();
    renderWithProviders(<PpdbForm />);
    await fillRequired(user);
    await user.click(screen.getByRole('button', { name: 'Kirim pendaftaran' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/belum terkirim/);
    expect(screen.getAllByLabelText(/Nama lengkap/)[0]).toHaveValue('Budi Santoso');
  });

  it('tidak mengirim apa pun bila kolom jebakan bot terisi', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<PpdbForm />);
    await fillRequired(user);
    const trap = container.querySelector<HTMLInputElement>('input[tabindex="-1"]');
    expect(trap).not.toBeNull();
    await user.type(trap as HTMLInputElement, 'spam');
    await user.click(screen.getByRole('button', { name: 'Kirim pendaftaran' }));
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument());
    expect(submitRegistration).not.toHaveBeenCalled();
  });
});
