import { useQuery } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_ROUTES, adminArticlePath, articlePath } from '@/app/routes';
import { AsyncView, EmptyBlock } from '@/components/ui/AsyncView';
import { ButtonLink } from '@/components/ui/Button';
import { ARTICLE_STATUSES } from '@/lib/supabase/types';
import { formatDate } from '@/lib/format';
import { useDocumentMeta } from '@/lib/hooks';
import { type ArticleRow, deleteArticle, listArticles } from '../api';
import { useAdminMutation } from '../useAdminMutation';
import { useConfirm } from '../useConfirm';

const STATUS_LABEL: Record<string, string> = { draft: 'Draf', published: 'Terbit' };

export function Articles() {
  useDocumentMeta('Artikel admin');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const deferredSearch = useDeferredValue(search);
  const query = useQuery({
    queryKey: ['admin', 'articles', deferredSearch, status],
    queryFn: () => listArticles(deferredSearch, status),
  });
  const { confirm, dialog } = useConfirm();
  const remove = useAdminMutation({ mutationFn: deleteArticle, success: 'Artikel dihapus' });

  const onDelete = async (article: ArticleRow) => {
    const ok = await confirm({ title: 'Hapus artikel?', message: `"${article.title}" akan dihapus permanen.` });
    if (ok) remove.mutate(article);
  };

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Artikel</h1>
        <ButtonLink to={ADMIN_ROUTES.newArticle} icon={Plus}>
          Tulis artikel
        </ButtonLink>
      </div>
      <div className="toolbar">
        <div className="field">
          <label className="field__label" htmlFor="article-search">
            Cari judul
          </label>
          <input id="article-search" className="input" type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="article-status">
            Status
          </label>
          <select id="article-status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Semua</option>
            {ARTICLE_STATUSES.map((item) => (
              <option key={item} value={item}>
                {STATUS_LABEL[item]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <AsyncView
        query={query}
        isEmpty={(rows) => rows.length === 0}
        empty={<EmptyBlock title="Belum ada artikel" text="Klik “Tulis artikel” untuk membuat yang pertama." />}
      >
        {(rows) => (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Judul</th>
                  <th scope="col">Kategori</th>
                  <th scope="col">Status</th>
                  <th scope="col">Tanggal</th>
                  <th scope="col">
                    <span className="visually-hidden">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link to={adminArticlePath(row.id)} className="table__title">
                        {row.title}
                      </Link>
                    </td>
                    <td>{row.category}</td>
                    <td>
                      <span className="status" data-status={row.status}>
                        {STATUS_LABEL[row.status] ?? row.status}
                      </span>
                    </td>
                    <td>{formatDate(row.published_at ?? row.created_at)}</td>
                    <td className="table__actions">
                      {row.status === 'published' && (
                        <a href={articlePath(row.slug)} target="_blank" rel="noopener noreferrer">
                          Lihat
                        </a>
                      )}
                      <Link to={adminArticlePath(row.id)} className="icon-button icon-button--light" aria-label={`Ubah ${row.title}`}>
                        <Pencil size={18} aria-hidden="true" />
                      </Link>
                      <button type="button" className="icon-button icon-button--light" aria-label={`Hapus ${row.title}`} onClick={() => void onDelete(row)}>
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AsyncView>
      {dialog}
    </>
  );
}
