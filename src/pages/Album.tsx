import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { PageBanner } from '@/components/layout/PageBanner';
import { AsyncView, EmptyBlock } from '@/components/ui/AsyncView';
import { PhotoGrid } from '@/features/gallery/PhotoGrid';
import { useAlbum } from '@/lib/api/hooks';
import { useDocumentMeta } from '@/lib/hooks';
import { NotFound } from './NotFound';

export function Album() {
  const { albumId = '' } = useParams();
  const query = useAlbum(albumId);
  useDocumentMeta(query.data?.title ?? 'Album', query.data?.description);

  return (
    <AsyncView query={query} loading={<PageBanner title="Memuat album…" />}>
      {(album) =>
        album === null ? (
          <NotFound />
        ) : (
        <>
          <PageBanner title={album.title} lead={album.description} />
          <section className="section">
            <div className="container">
              <Link to={ROUTES.gallery} className="link-arrow link-arrow--back">
                <ArrowLeft size={18} aria-hidden="true" /> Semua album
              </Link>
              {album.photos.length === 0 ? (
                <EmptyBlock title="Album ini belum berisi foto." />
              ) : (
                <PhotoGrid
                  photos={album.photos.map((photo) => ({
                    key: photo.id,
                    src: photo.file_url,
                    alt: photo.caption || album.title,
                    caption: photo.caption,
                  }))}
                />
              )}
            </div>
          </section>
        </>
        )
      }
    </AsyncView>
  );
}
