import { Link } from 'react-router-dom';
import { articlePath } from '@/app/routes';
import { PHOTOS } from '@/data/photos';
import type { ArticleCard as ArticleCardData } from '@/lib/api/content';
import { formatDate } from '@/lib/format';

export function ArticleCard({ article }: { article: ArticleCardData }) {
  const cover = article.cover_image_url;
  return (
    <article className="news-card">
      <Link to={articlePath(article.slug)} className="news-card__link">
        <div className="news-card__media">
          <img
            src={cover ?? PHOTOS.campus.src}
            alt=""
            width={800}
            height={450}
            loading="lazy"
            decoding="async"
            data-placeholder={cover ? undefined : ''}
          />
        </div>
        <div className="news-card__body">
          <p className="news-card__meta">
            <span className="badge">{article.category}</span>
            <time dateTime={article.published_at ?? article.created_at}>
              {formatDate(article.published_at ?? article.created_at)}
            </time>
          </p>
          <h2 className="news-card__title">{article.title}</h2>
          {article.excerpt && <p className="news-card__excerpt">{article.excerpt}</p>}
        </div>
      </Link>
    </article>
  );
}
