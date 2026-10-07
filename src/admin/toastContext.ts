import { createContext, useContext } from 'react';

export type ToastTone = 'success' | 'error';
export type Notify = (message: string, tone?: ToastTone) => void;

export const ToastContext = createContext<Notify | null>(null);

export function useToast(): Notify {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error('useToast harus dipakai di dalam ToastProvider');
  return notify;
}
