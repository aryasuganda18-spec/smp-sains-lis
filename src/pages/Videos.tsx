import { PageBanner } from '@/components/layout/PageBanner';
import { AsyncView } from '@/components/ui/AsyncView';
import { VideoCard } from '@/features/videos/VideoCard';
import { useVideos } from '@/lib/api/hooks';
import { useDocumentMeta } from '@/lib/hooks';

export function Videos() {
  useDocumentMeta('Video', 'Dokumentasi video kegiatan SMP Sains Lombok Islamic School.');
  const query = useVideos();

  return (
    <>
      <PageBanner title="Video" lead="Dokumentasi kegiatan dan profil sekolah." />
      <section className="section">
        <div className="container">
          <AsyncView
            query={query}
            isEmpty={(data) => data.length === 0}
            empty={<p className="muted">Belum ada video yang dipublikasikan.</p>}
          >
            {(videos) => (
              <ul className="card-grid card-grid--2">
                {videos.map((video) => (
                  <li key={video.id}>
                    <VideoCard video={video} />
                  </li>
                ))}
              </ul>
            )}
          </AsyncView>
        </div>
      </section>
    </>
  );
}
