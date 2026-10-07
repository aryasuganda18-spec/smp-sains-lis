import { type ReactNode, useEffect, useRef } from 'react';

interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  closeOnBackdrop?: boolean;
  children: ReactNode;
}

export function ModalDialog({ open, onClose, label, className, closeOnBackdrop = true, children }: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !closeOnBackdrop) return;
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) onClose();
    };
    dialog.addEventListener('click', onClick);
    return () => dialog.removeEventListener('click', onClick);
  }, [closeOnBackdrop, onClose]);

  return (
    <dialog ref={dialogRef} className={className} aria-label={label} onClose={onClose}>
      {open ? children : null}
    </dialog>
  );
}
