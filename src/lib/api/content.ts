import { publicDb } from '@/lib/supabase/publicClient';
import type { AlbumSummary, Announcement, Article, GalleryPhoto, RegistrationInsert, Video } from '@/lib/supabase/types';
import { isUuid } from '@/lib/slug';
import { assertOk, unwrap, unwrapOptional } from './errors';

export const ARTICLES_PAGE_SIZE = 9;
const LIST_LIMIT = 60;

export type ArticleCard = Pick<
  Article,
  'id' | 'title' | 'slug' | 'excerpt' | 'category' | 'author' | 'cover_image_url' | 'published_at' | 'created_at'
>;
export type PublicVideo = Pick<Video, 'id' | 'title' | 'video_url' | 'description' | 'created_at'>;
type PublicPhoto = Pick<GalleryPhoto, 'id' | 'file_url' | 'caption'>;

export async function fetchArticlesPage(category: string | null, offset: number) {
  let query = publicDb
    .from('articles')
    .select('id,title,slug,excerpt,category,author,cover_image_url,published_at,created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + ARTICLES_PAGE_SIZE);
  if (category) query = query.eq('category', category);

  const rows: ArticleCard[] = unwrap(await query);
  return { items: rows.slice(0, ARTICLES_PAGE_SIZE), hasMore: rows.length > ARTICLES_PAGE_SIZE };
}

export async function fetchArticle(slug: string): Promise<Article | null> {
  return unwrapOptional(
    await publicDb.from('articles').select('*').eq('slug', slug).eq('status', 'published').maybeSingle(),
  );
}

export async function fetchAlbums(): Promise<AlbumSummary[]> {
  const rows = unwrap(
    await publicDb
      .from('albums_with_cover')
      .select('id,title,description,cover_image_url')
      .order('created_at', { ascending: false }),
  );
  return rows.flatMap((row) =>
    row.id && row.title
      ? [{ id: row.id, title: row.title, description: row.description ?? '', cover_image_url: row.cover_image_url }]
      : [],
  );
}

export async function fetchAlbumWithPhotos(albumId: string) {
  if (!isUuid(albumId)) return null;

  const [albumResult, photosResult] = await Promise.all([
    publicDb
      .from('albums_with_cover')
      .select('id,title,description')
      .eq('id', albumId)
      .maybeSingle(),
    publicDb
      .from('gallery_photos')
      .select('id,file_url,caption')
      .eq('album_id', albumId)
      .order('created_at', { ascending: true }),
  ]);

  const album = unwrapOptional(albumResult);
  if (!album?.title) return null;
  const photos: PublicPhoto[] = unwrap(photosResult);
  return { title: album.title, description: album.description ?? '', photos };
}

export async function fetchVideos(): Promise<PublicVideo[]> {
  return unwrap(
    await publicDb
      .from('videos')
      .select('id,title,video_url,description,created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(LIST_LIMIT),
  );
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  return unwrap(
    await publicDb
      .from('announcements')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(LIST_LIMIT),
  );
}

export async function submitRegistration(payload: RegistrationInsert): Promise<void> {
  assertOk(await publicDb.from('ppdb_registrations').insert(payload));
}
