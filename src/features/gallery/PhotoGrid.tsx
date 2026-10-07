import { useState } from 'react';
import { Lightbox, type LightboxPhoto } from './Lightbox';

export interface GridPhoto extends LightboxPhoto {
  srcSet?: string;
  width?: number;
  height?: number;
}

export function PhotoGrid({ photos }: { photos: readonly GridPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="photo-grid">
        {photos.map((photo, index) => (
          <li key={photo.key}>
            <button
              type="button"
              className="photo-grid__item"
              onClick={() => setOpenIndex(index)}
              aria-label={`Perbesar foto: ${photo.caption ?? photo.alt}`}
            >
              <img
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
              />
              {photo.caption && <span className="photo-grid__caption">{photo.caption}</span>}
            </button>
          </li>
        ))}
      </ul>
      <Lightbox photos={photos} index={openIndex} onIndexChange={setOpenIndex} />
    </>
  );
}
