import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AsyncView } from './AsyncView';

const base = { isPending: false, isError: false, data: undefined as string[] | undefined, refetch: vi.fn() };

describe('AsyncView', () => {
  it('menampilkan loading, galat dengan tombol coba lagi, kosong, dan data', async () => {
    const user = userEvent.setup();
    const children = (data: string[]) => <p>{data.join(',')}</p>;
    const { rerender } = render(<AsyncView query={{ ...base, isPending: true }}>{children}</AsyncView>);
    expect(screen.getByRole('status')).toHaveTextContent('Memuat');

    const refetch = vi.fn();
    rerender(<AsyncView query={{ ...base, isError: true, refetch }}>{children}</AsyncView>);
    await user.click(screen.getByRole('button', { name: 'Coba lagi' }));
    expect(refetch).toHaveBeenCalledOnce();

    rerender(
      <AsyncView query={{ ...base, data: [] }} isEmpty={(d) => d.length === 0} empty={<p>Kosong</p>}>
        {children}
      </AsyncView>,
    );
    expect(screen.getByText('Kosong')).toBeInTheDocument();

    rerender(<AsyncView query={{ ...base, data: ['a', 'b'] }}>{children}</AsyncView>);
    expect(screen.getByText('a,b')).toBeInTheDocument();
  });
});
