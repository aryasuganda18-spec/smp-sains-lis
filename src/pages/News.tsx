import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { PageBanner } from '@/components/layout/PageBanner';
import { AsyncView } from '@/components/ui/AsyncView';
import { Button } from '@/components/ui/Button';
import { ARTICLE_CATEGORIES } from '@/data/site';
import { ArticleCard } from '@/features/news/ArticleCard';
import { useArticleList } from '@/lib/api/hooks';
import { useDocumentMeta } from '@/lib/hooks';

const CATEGORY_PARAM = 'kategori';

export function News() {
  useDocumentMeta('Berita', 'Kabar terbaru kegiatan dan prestasi SMP Sains Lombok Islamic School.');
  const [params] = useSearchParams();
  const requested = params.get(CATEGORY_PARAM);
  const category = ARTICLE_CATEGORIES.find((item) => item === requested) ?? null;
  const query = useArticleList(category);

  return (
    <>
      <PageBanner title="Berita" lead="Kabar terbaru dari kegiatan dan prestasi sekolah." />
      <section className="section">
        <div className="container">
          <nav aria-label="Filter kategori" className="chips">
            <Link to={ROUTES.news} className="chip" aria-current={category === null ? 'true' : undefined}>
              Semua
            </Link>
            {ARTICLE_CATEGORIES.map((item) => (
              <Link
                key={item}
                to={`${ROUTES.news}?${CATEGORY_PARAM}=${encodeURIComponent(item)}`}
                className="chip"
                aria-current={category === item ? 'true' : undefined}
              >
                {item}
              </Link>
            ))}
          </nav>

          <AsyncView
            query={query}
            isEmpty={(data) => data.pages[0]?.items.length === 0}
            empty={<p className="muted">Belum ada berita{category ? ` pada kategori ${category}` : ''}.</p>}
          >
            {(data) => (
              <>
                <ul className="card-grid card-grid--3">
                  {data.pages.flatMap((page) =>
                    page.items.map((article) => (
                      <li key={article.id}>
                        <ArticleCard article={article} />
                      </li>
                    )),
                  )}
                </ul>
                {query.hasNextPage && (
                  <div className="load-more">
                    <Button variant="outline" onClick={() => void query.fetchNextPage()} disabled={query.isFetchingNextPage}>
                      {query.isFetchingNextPage ? 'Memuat…' : 'Muat lebih banyak'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </AsyncView>
        </div>
      </section>
    </>
  );
}
