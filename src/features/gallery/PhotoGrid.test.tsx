import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PhotoGrid } from './PhotoGrid';

const photos = [
  { key: 'a', src: '/a.webp', alt: 'Foto A', caption: 'A' },
  { key: 'b', src: '/b.webp', alt: 'Foto B', caption: 'B' },
  { key: 'c', src: '/c.webp', alt: 'Foto C', caption: 'C' },
];

describe('PhotoGrid dan Lightbox', () => {
  it('membuka foto, bernavigasi melingkar, dan menutup', async () => {
    const user = userEvent.setup();
    render(<PhotoGrid photos={photos} />);
    await user.click(screen.getByRole('button', { name: 'Perbesar foto: A' }));

    const dialog = screen.getByRole('dialog', { name: 'Penampil foto', hidden: true });
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Foto sebelumnya', hidden: true }));
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tutup', hidden: true }));
    expect(dialog).not.toHaveAttribute('open');
  });
});
