import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ImagePlus, Save, Trash2 } from 'lucide-react';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { ADMIN_ROUTES } from '@/app/routes';
import { AsyncView, LoadingBlock } from '@/components/ui/AsyncView';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { NotFound } from '@/pages/NotFound';
import { ARTICLE_CATEGORIES } from '@/data/site';
import { stripHtml } from '@/lib/format';
import { useDocumentMeta } from '@/lib/hooks';
import { validateImageFile } from '@/lib/image';
import { randomSuffix, slugify } from '@/lib/slug';
import { ARTICLE_STATUSES, type Article } from '@/lib/supabase/types';
import { createArticle, getArticle, updateArticle } from '../api';
import { isUniqueViolation } from '../errors';
import { type StoredImage, removeImages, uploadImage } from '../storage';
import { useAdminMutation } from '../useAdminMutation';
import { useToast } from '../toastContext';

const RichTextEditor = lazy(() => import('../RichTextEditor'));

const articleSchema = z
  .object({
    title: z.string().trim().min(3, 'Judul minimal 3 karakter').max(150, 'Maksimal 150 karakter'),
    excerpt: z.string().trim().max(300, 'Maksimal 300 karakter'),
    category: z.enum(ARTICLE_CATEGORIES),
    author: z.string().trim().max(100, 'Maksimal 100 karakter'),
    status: z.enum(ARTICLE_STATUSES),
    content: z.string(),
  })
  .refine((v) => v.status !== 'published' || stripHtml(v.content) !== '', {
    path: ['content'],
    message: 'Isi artikel wajib diisi sebelum diterbitkan',
  });
type ArticleValues = z.infer<typeof articleSchema>;

const SLUG_ATTEMPTS = 3;

async function createWithUniqueSlug(values: ArticleValues, extra: Partial<Article>): Promise<Article> {
  const base = slugify(values.title) || 'artikel';
  for (let attempt = 0; ; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${randomSuffix()}`;
    try {
      return await createArticle({ ...values, ...extra, slug });
    } catch (error) {
      if (!isUniqueViolation(error) || attempt >= SLUG_ATTEMPTS) throw error;
    }
  }
}

interface CoverState {
  file: File | null;
  previewUrl: string | null;
  removed: boolean;
}

function ArticleForm({ article }: { article: Article | null }) {
  const navigate = useNavigate();
  const notify = useToast();
  const [cover, setCover] = useState<CoverState>({ file: null, previewUrl: null, removed: false });
  const previewRef = useRef<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title ?? '',
      excerpt: article?.excerpt ?? '',
      category: ARTICLE_CATEGORIES.find((c) => c === article?.category) ?? 'Umum',
      author: article?.author ?? '',
      status: article?.status === 'published' ? 'published' : 'draft',
      content: article?.content ?? '',
    },
  });

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  const changeCover = (next: { file: File | null; removed: boolean }) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const previewUrl = next.file ? URL.createObjectURL(next.file) : null;
    previewRef.current = previewUrl;
    setCover({ ...next, previewUrl });
  };

  const save = useAdminMutation({
    mutationFn: async (values: ArticleValues) => {
      let uploaded: StoredImage | null = null;
      if (cover.file) uploaded = await uploadImage(cover.file, 'articles');

      const coverFields: Partial<Article> = uploaded
        ? { cover_image_path: uploaded.path, cover_image_url: uploaded.url }
        : cover.removed
          ? { cover_image_path: null, cover_image_url: null }
          : {};
      const publishedAt = article?.published_at ?? (values.status === 'published' ? new Date().toISOString() : null);

      try {
        const saved = article
          ? await updateArticle(article.id, { ...values, ...coverFields, published_at: publishedAt })
          : await createWithUniqueSlug(values, { ...coverFields, published_at: publishedAt });
        if ((uploaded || cover.removed) && article?.cover_image_path) await removeImages([article.cover_image_path]);
        return saved;
      } catch (error) {
        await removeImages([uploaded?.path]);
        throw error;
      }
    },
    success: 'Artikel disimpan',
    onSuccess: () => void navigate(ADMIN_ROUTES.articles),
  });

  const currentCover = cover.removed ? null : (cover.previewUrl ?? article?.cover_image_url ?? null);

  const onPickCover = (file: File | undefined) => {
    if (!file) return;
    const problem = validateImageFile(file);
    if (problem) notify(problem, 'error');
    else changeCover({ file, removed: false });
  };

  return (
    <form className="editor" onSubmit={(event) => void handleSubmit((values) => save.mutate(values))(event)} noValidate>
      <Field label="Judul" required error={errors.title?.message}>
        {(c) => <input className="input" {...c} {...register('title')} />}
      </Field>
      <Field label="Ringkasan" optional hint="Tampil di daftar berita dan hasil pencarian" error={errors.excerpt?.message}>
        {(c) => <textarea className="input" rows={2} {...c} {...register('excerpt')} />}
      </Field>
      <div className="form__row form__row--3">
        <Field label="Kategori" error={errors.category?.message}>
          {(c) => (
            <select className="input" {...c} {...register('category')}>
              {ARTICLE_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Penulis" optional error={errors.author?.message}>
          {(c) => <input className="input" {...c} {...register('author')} />}
        </Field>
        <Field label="Status" error={errors.status?.message}>
          {(c) => (
            <select className="input" {...c} {...register('status')}>
              <option value="draft">Draf (belum tampil)</option>
              <option value="published">Terbit</option>
            </select>
          )}
        </Field>
      </div>

      <div className="field">
        <span className="field__label">Gambar sampul</span>
        {currentCover && <img className="editor__cover" src={currentCover} alt="Pratinjau sampul" />}
        <div className="editor__cover-actions">
          <label className="button button--outline button--sm">
            <ImagePlus size={18} aria-hidden="true" />
            {currentCover ? 'Ganti gambar' : 'Pilih gambar'}
            <input
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                onPickCover(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
          </label>
          {currentCover && (
            <Button size="sm" variant="ghost" icon={Trash2} onClick={() => changeCover({ file: null, removed: true })}>
              Hapus sampul
            </Button>
          )}
        </div>
      </div>

      <Field label="Isi artikel" error={errors.content?.message}>
        {(c) => (
          <div id={c.id} aria-describedby={c['aria-describedby']}>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <Suspense fallback={<LoadingBlock label="Memuat editor…" />}>
                  <RichTextEditor value={field.value} onChange={field.onChange} label="Isi artikel" />
                </Suspense>
              )}
            />
          </div>
        )}
      </Field>

      <div className="editor__actions">
        <Button type="submit" icon={Save} size="lg" disabled={save.isPending}>
          {save.isPending ? 'Menyimpan…' : 'Simpan artikel'}
        </Button>
        <Link to={ADMIN_ROUTES.articles} className="button button--ghost button--lg">
          Batal
        </Link>
      </div>
    </form>
  );
}

export function ArticleEditor() {
  const { id } = useParams();
  const isNew = id === undefined;
  useDocumentMeta(isNew ? 'Artikel baru' : 'Ubah artikel');
  const query = useQuery({
    queryKey: ['admin', 'article', id],
    queryFn: () => getArticle(id ?? ''),
    enabled: !isNew,
    gcTime: 0,
  });

  return (
    <>
      <Link to={ADMIN_ROUTES.articles} className="link-arrow link-arrow--back">
        <ArrowLeft size={18} aria-hidden="true" /> Semua artikel
      </Link>
      <h1 className="admin__title">{isNew ? 'Artikel baru' : 'Ubah artikel'}</h1>
      {isNew ? (
        <ArticleForm article={null} />
      ) : (
        <AsyncView query={query}>{(article) => (article ? <ArticleForm article={article} /> : <NotFound />)}</AsyncView>
      )}
    </>
  );
}
