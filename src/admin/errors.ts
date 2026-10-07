import { ApiError } from '@/lib/api/errors';

const POSTGRES_UNIQUE_VIOLATION = '23505';
const POSTGRES_INSUFFICIENT_PRIVILEGE = '42501';

export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === POSTGRES_UNIQUE_VIOLATION) return 'Data dengan nilai yang sama sudah ada.';
    if (error.code === POSTGRES_INSUFFICIENT_PRIVILEGE) return 'Akun Anda tidak punya izin untuk tindakan ini.';
  }
  return 'Terjadi kesalahan. Periksa koneksi internet lalu coba lagi.';
}

export const isUniqueViolation = (error: unknown): boolean =>
  error instanceof ApiError && error.code === POSTGRES_UNIQUE_VIOLATION;
