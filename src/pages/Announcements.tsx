import { PageBanner } from '@/components/layout/PageBanner';
import { AsyncView } from '@/components/ui/AsyncView';
import { useAnnouncements } from '@/lib/api/hooks';
import { formatDate } from '@/lib/format';
import { useDocumentMeta } from '@/lib/hooks';

export function Announcements() {
  useDocumentMeta('Pengumuman', 'Pengumuman resmi untuk orang tua dan calon siswa.');
  const query = useAnnouncements();

  return (
    <>
      <PageBanner title="Pengumuman" lead="Informasi penting untuk orang tua dan calon siswa." />
      <section className="section">
        <div className="container container--narrow">
          <AsyncView
            query={query}
            isEmpty={(data) => data.length === 0}
            empty={<p className="muted">Belum ada pengumuman.</p>}
          >
            {(items) => (
              <ul className="stack">
                {items.map((item) => (
                  <li key={item.id}>
                    <article className="card announcement">
                      <time dateTime={item.created_at} className="muted">
                        {formatDate(item.created_at)}
                      </time>
                      <h2 className="announcement__title">{item.title}</h2>
                      <p className="announcement__text">{item.content}</p>
                    </article>
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
