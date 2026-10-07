import { CircleAlert, Inbox, LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { PUBLIC_LOAD_ERROR } from '@/lib/api/errors';
import { Button } from './Button';

export function LoadingBlock({ label = 'Memuat…' }: { label?: string }) {
  return (
    <div className="state state--loading" role="status">
      <LoaderCircle className="state__spinner" size={22} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function ErrorBlock({ onRetry, message = PUBLIC_LOAD_ERROR }: { onRetry?: () => void; message?: string }) {
  return (
    <div className="state state--error" role="alert">
      <CircleAlert size={22} aria-hidden="true" />
      <p>{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </div>
  );
}

export function EmptyBlock({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="state state--empty">
      <Inbox size={26} aria-hidden="true" />
      <p className="state__title">{title}</p>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

interface QueryLike<T> {
  isPending: boolean;
  isError: boolean;
  data: T | undefined;
  refetch: () => unknown;
}

interface AsyncViewProps<T> {
  query: QueryLike<T>;
  loading?: ReactNode;
  empty?: ReactNode;
  isEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
}

export function AsyncView<T>({ query, loading, empty, isEmpty, children }: AsyncViewProps<T>) {
  if (query.isPending) return <>{loading ?? <LoadingBlock />}</>;
  if (query.isError || query.data === undefined) return <ErrorBlock onRetry={() => void query.refetch()} />;
  if (isEmpty?.(query.data)) return <>{empty}</>;
  return <>{children(query.data)}</>;
}
