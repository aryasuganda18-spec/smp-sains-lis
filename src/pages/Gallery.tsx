import { Link } from 'react-router-dom';
import { albumPath } from '@/app/routes';
import { PageBanner } from '@/components/layout/PageBanner';
import { AsyncView } from '@/components/ui/AsyncView';
import { CAMPUS_GALLERY, toGridPhoto } from '@/data/photos';
import { PhotoGrid } from '@/features/gallery/PhotoGrid';
import { useAlbums } from '@/lib/api/hooks';
import { useDocumentMeta } from '@/lib/hooks';

export function Gallery() {
  useDocumentMeta('Galeri', 'Foto kegiatan dan fasilitas SMP Sains Lombok Islamic School.');
  const albums = useAlbums();

  return (
    <>
      <PageBanner title="Galeri" lead="Kegiatan belajar, fasilitas, dan momen di kampus." />
      <section className="section" aria-labelledby="album-title">
        <div className="container">
          <h2 id="album-title" className="section__title">
            Album kegiatan
          </h2>
          <AsyncView
            query={albums}
            isEmpty={(data) => data.length === 0}
            empty={
              <p className="muted">
                Album kegiatan akan tampil di sini setelah sekolah mengunggahnya.
              </p>
            }
          >
            {(data) => (
              <ul className="card-grid card-grid--3">
                {data.map((album) => (
                  <li key={album.id} className="album-card">
                    <Link to={albumPath(album.id)}>
                      {album.cover_image_url ? (
                        <img
                          src={album.cover_image_url}
                          alt=""
                          width={800}
                          height={600}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="album-card__placeholder" aria-hidden="true" />
                      )}
                      <span className="album-card__title">{album.title}</span>
                      {album.description && (
                        <span className="album-card__text">{album.description}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </AsyncView>
        </div>
      </section>
      <section className="section section--sand" aria-labelledby="kampus-foto-title">
        <div className="container">
          <h2 id="kampus-foto-title" className="section__title">
            Dokumentasi
          </h2>
          <PhotoGrid photos={CAMPUS_GALLERY.map((photo) => toGridPhoto(photo.caption, photo))} />
        </div>
      </section>
    </>
  );
}
