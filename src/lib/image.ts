const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1600;

export interface PreparedImage {
  blob: Blob;
  extension: 'webp' | 'jpg';
  contentType: 'image/webp' | 'image/jpeg';
}

export function validateImageFile(file: File): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return 'Format gambar harus JPG, PNG, atau WebP.';
  }
  if (file.size > MAX_SOURCE_BYTES) return 'Ukuran gambar maksimal 15 MB.';
  return null;
}

export function fitWithin(width: number, height: number, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  const problem = validateImageFile(file);
  if (problem) throw new Error(problem);

  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_IMAGE_EDGE);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Browser tidak mendukung pengolahan gambar.');
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const webp = await canvasToBlob(canvas, 'image/webp', 0.82);
  if (webp?.type === 'image/webp') return { blob: webp, extension: 'webp', contentType: 'image/webp' };

  const jpeg = await canvasToBlob(canvas, 'image/jpeg', 0.85);
  if (!jpeg) throw new Error('Gagal memproses gambar.');
  return { blob: jpeg, extension: 'jpg', contentType: 'image/jpeg' };
}
