export class ApiError extends Error {
  readonly code: string | undefined;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

interface PostgrestResult<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

export function unwrap<T>(result: PostgrestResult<T>): T {
  if (result.error) throw new ApiError(result.error.message, result.error.code);
  if (result.data === null) throw new ApiError('Data tidak ditemukan', 'NOT_FOUND');
  return result.data;
}

export function unwrapOptional<T>(result: PostgrestResult<T>): T | null {
  if (result.error) throw new ApiError(result.error.message, result.error.code);
  return result.data;
}

export function assertOk(result: { error: { message: string; code?: string } | null }): void {
  if (result.error) throw new ApiError(result.error.message, result.error.code);
}

export const PUBLIC_LOAD_ERROR = 'Data belum bisa dimuat. Periksa koneksi internet Anda, lalu coba lagi.';
