import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ModalDialog } from '@/components/ui/ModalDialog';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
}

export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((confirmed: boolean) => void) | null>(null);

  const confirm = useCallback(
    (next: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOptions(next);
      }),
    [],
  );

  const settle = (confirmed: boolean) => {
    resolver.current?.(confirmed);
    resolver.current = null;
    setOptions(null);
  };

  const dialog = (
    <ModalDialog open={options !== null} onClose={() => settle(false)} label={options?.title ?? 'Konfirmasi'} className="modal">
      {options && (
        <div className="modal__body">
          <h2 className="modal__title">{options.title}</h2>
          <p>{options.message}</p>
          <div className="modal__actions">
            <Button variant="ghost" onClick={() => settle(false)}>
              Batal
            </Button>
            <Button variant="danger" onClick={() => settle(true)}>
              {options.confirmLabel ?? 'Hapus'}
            </Button>
          </div>
        </div>
      )}
    </ModalDialog>
  );

  return { confirm, dialog };
}
