import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect } from 'react';
import { ModalDialog } from '@/components/ui/ModalDialog';

export interface LightboxPhoto {
  key: string;
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  photos: readonly LightboxPhoto[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

export function Lightbox({ photos, index, onIndexChange }: LightboxProps) {
  const open = index !== null;
  const photo = index === null ? undefined : photos[index];

  useEffect(() => {
    if (index === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') onIndexChange((index + 1) % photos.length);
      if (event.key === 'ArrowLeft') onIndexChange((index - 1 + photos.length) % photos.length);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [index, photos.length, onIndexChange]);

  const step = (delta: number) => {
    if (index !== null) onIndexChange((index + delta + photos.length) % photos.length);
  };

  return (
    <ModalDialog open={open} onClose={() => onIndexChange(null)} label="Penampil foto" className="lightbox on-dark">
      {photo && index !== null && (
        <figure className="lightbox__figure">
          <img src={photo.src} alt={photo.alt} className="lightbox__image" />
          <figcaption>
            {photo.caption && <span>{photo.caption}</span>}
            <span className="lightbox__count">
              {index + 1} / {photos.length}
            </span>
          </figcaption>
        </figure>
      )}
      <button type="button" className="icon-button lightbox__close" onClick={() => onIndexChange(null)} aria-label="Tutup">
        <X size={24} aria-hidden="true" />
      </button>
      {photos.length > 1 && (
        <>
          <button type="button" className="icon-button lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label="Foto sebelumnya">
            <ChevronLeft size={28} aria-hidden="true" />
          </button>
          <button type="button" className="icon-button lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label="Foto berikutnya">
            <ChevronRight size={28} aria-hidden="true" />
          </button>
        </>
      )}
    </ModalDialog>
  );
}
