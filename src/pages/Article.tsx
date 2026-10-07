import { ArrowLeft, Share2 } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { AsyncView, LoadingBlock } from '@/components/ui/AsyncView';
import { ButtonLink } from '@/components/ui/Button';
import { useArticle } from '@/lib/api/hooks';
import { formatDate } from '@/lib/format';
import { useDocumentMeta } from '@/lib/hooks';
import { sanitizeArticleHtml } from '@/lib/sanitize';
import { whatsAppShareLink } from '@/lib/whatsapp';
import { NotFound } from './NotFound';

export function Article() {
  const { slug = '' } = useParams();
  const query = useArticle(slug);
  const article = query.data;
  useDocumentMeta(article?.title ?? 'Berita', article?.excerpt);
  const html = useMemo(() => (article ? sanitizeArticleHtml(article.content) : ''), [article]);

  return (
    <AsyncView query={query} loading={<div className="container section"><LoadingBlock label="Memuat berita…" /></div>}>
      {(data) =>
        data === null ? (
          <NotFound />
        ) : (
          <article className="section article">
            <div className="container container--narrow">
              <Link to={ROUTES.news} className="link-arrow link-arrow--back">
                <ArrowLeft size={18} aria-hidden="true" /> Semua berita
              </Link>
              <header className="article__head">
                <p className="news-card__meta">
                  <span className="badge">{data.category}</span>
                  <time dateTime={data.published_at ?? data.created_at}>
                    {formatDate(data.published_at ?? data.created_at)}
                  </time>
                  {data.author && <span>Oleh {data.author}</span>}
                </p>
                <h1>{data.title}</h1>
                {data.excerpt && <p className="lead">{data.excerpt}</p>}
              </header>
              {data.cover_image_url && (
                <img className="article__cover" src={data.cover_image_url} alt="" width={1200} height={675} />
              )}
              <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
              <footer className="article__foot">
                <ButtonLink
                  href={whatsAppShareLink(`${data.title} ${window.location.href}`)}
                  variant="outline"
                  icon={Share2}
                >
                  Bagikan lewat WhatsApp
                </ButtonLink>
              </footer>
            </div>
          </article>
        )
      }
    </AsyncView>
  );
}
