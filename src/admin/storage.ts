import { ApiError } from '@/lib/api/errors';
import { prepareImage } from '@/lib/image';
import { adminDb } from './supabase';

const BUCKET = 'cms-media';

export type MediaFolder = 'articles' | 'albums';

export interface StoredImage {
  path: string;
  url: string;
}

export async function uploadImage(file: File, folder: MediaFolder): Promise<StoredImage> {
  const prepared = await prepareImage(file);
  const path = `${folder}/${crypto.randomUUID()}.${prepared.extension}`;
  const { error } = await adminDb.storage.from(BUCKET).upload(path, prepared.blob, {
    contentType: prepared.contentType,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw new ApiError(error.message);
  return { path, url: adminDb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
}

export async function removeImages(paths: readonly (string | null | undefined)[]): Promise<void> {
  const existing = paths.filter((path): path is string => Boolean(path));
  if (existing.length > 0) await adminDb.storage.from(BUCKET).remove(existing);
}
