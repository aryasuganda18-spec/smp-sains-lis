import { assertOk, unwrap, unwrapOptional } from '@/lib/api/errors';
import { escapeLike, sanitizeSearchTerm } from '@/lib/search';
import type {
  Album,
  Announcement,
  Article,
  ArticleInsert,
  ArticleUpdate,
  GalleryPhoto,
  Registration,
  RegistrationStatus,
  Video,
} from '@/lib/supabase/types';
import { adminDb } from './supabase';
import { removeImages } from './storage';

export const REGISTRATIONS_PAGE_SIZE = 20;


export interface DashboardCounts {
  articles: number;
  publishedArticles: number;
  albums: number;
  photos: number;
  videos: number;
  announcements: number;
  registrations: number;
  newRegistrations: number;
}

async function count(table: 'articles' | 'albums' | 'gallery_photos' | 'videos' | 'announcements' | 'ppdb_registrations', filter?: [string, string | boolean]) {
  let query = adminDb.from(table).select('id', { count: 'exact', head: true });
  if (filter) query = query.eq(filter[0], filter[1]);
  const { count: total, error } = await query;
  if (error) throw new Error(error.message);
  return total ?? 0;
}

export async function fetchDashboardCounts(): Promise<DashboardCounts> {
  const [articles, publishedArticles, albums, photos, videos, announcements, registrations, newRegistrations] =
    await Promise.all([
      count('articles'),
      count('articles', ['status', 'published']),
      count('albums'),
      count('gallery_photos'),
      count('videos'),
      count('announcements'),
      count('ppdb_registrations'),
      count('ppdb_registrations', ['status', 'baru']),
    ]);
  return { articles, publishedArticles, albums, photos, videos, announcements, registrations, newRegistrations };
}

export type ArticleRow = Pick<
  Article,
  'id' | 'title' | 'slug' | 'category' | 'status' | 'published_at' | 'created_at' | 'cover_image_path'
>;

export async function listArticles(search: string, status: string): Promise<ArticleRow[]> {
  let query = adminDb
    .from('articles')
    .select('id,title,slug,category,status,published_at,created_at,cover_image_path')
    .order('created_at', { ascending: false })
    .limit(200);
  const term = sanitizeSearchTerm(search);
  if (term) query = query.ilike('title', `%${escapeLike(term)}%`);
  if (status) query = query.eq('status', status);
  return unwrap(await query);
}

export async function getArticle(id: string): Promise<Article | null> {
  return unwrapOptional(await adminDb.from('articles').select('*').eq('id', id).maybeSingle());
}

export async function createArticle(values: ArticleInsert): Promise<Article> {
  return unwrap(await adminDb.from('articles').insert(values).select().single());
}

export async function updateArticle(id: string, values: ArticleUpdate): Promise<Article> {
  return unwrap(await adminDb.from('articles').update(values).eq('id', id).select().single());
}

export async function deleteArticle(article: Pick<Article, 'id' | 'cover_image_path'>): Promise<void> {
  assertOk(await adminDb.from('articles').delete().eq('id', article.id));
  await removeImages([article.cover_image_path]);
}

export async function listAlbums(): Promise<Album[]> {
  return unwrap(await adminDb.from('albums').select('*').order('created_at', { ascending: false }));
}

export async function getAlbum(id: string): Promise<Album | null> {
  return unwrapOptional(await adminDb.from('albums').select('*').eq('id', id).maybeSingle());
}

export async function createAlbum(values: { title: string; description: string }): Promise<Album> {
  return unwrap(await adminDb.from('albums').insert(values).select().single());
}

export async function updateAlbum(id: string, values: { title: string; description: string }): Promise<void> {
  assertOk(await adminDb.from('albums').update(values).eq('id', id));
}

export async function setAlbumCover(albumId: string, photo: Pick<GalleryPhoto, 'file_path' | 'file_url'> | null): Promise<void> {
  assertOk(
    await adminDb
      .from('albums')
      .update({ cover_image_path: photo?.file_path ?? null, cover_image_url: photo?.file_url ?? null })
      .eq('id', albumId),
  );
}

export async function deleteAlbum(albumId: string): Promise<void> {
  const photos = unwrap(await adminDb.from('gallery_photos').select('file_path').eq('album_id', albumId));
  assertOk(await adminDb.from('gallery_photos').delete().eq('album_id', albumId));
  assertOk(await adminDb.from('albums').delete().eq('id', albumId));
  await removeImages(photos.map((photo) => photo.file_path));
}

export async function listPhotos(albumId: string): Promise<GalleryPhoto[]> {
  return unwrap(
    await adminDb.from('gallery_photos').select('*').eq('album_id', albumId).order('created_at', { ascending: true }),
  );
}

export async function addPhoto(albumId: string, image: { path: string; url: string }): Promise<GalleryPhoto> {
  return unwrap(
    await adminDb
      .from('gallery_photos')
      .insert({ album_id: albumId, file_path: image.path, file_url: image.url })
      .select()
      .single(),
  );
}

export async function updatePhotoCaption(photoId: string, caption: string): Promise<void> {
  assertOk(await adminDb.from('gallery_photos').update({ caption }).eq('id', photoId));
}

export async function deletePhoto(photo: GalleryPhoto, album: Pick<Album, 'id' | 'cover_image_path'>): Promise<void> {
  assertOk(await adminDb.from('gallery_photos').delete().eq('id', photo.id));
  if (album.cover_image_path === photo.file_path) await setAlbumCover(album.id, null);
  await removeImages([photo.file_path]);
}

export type VideoValues = Pick<Video, 'title' | 'video_url' | 'description' | 'published' | 'thumbnail'>;

export async function listVideos(): Promise<Video[]> {
  return unwrap(await adminDb.from('videos').select('*').order('created_at', { ascending: false }));
}

export async function saveVideo(id: string | null, values: VideoValues): Promise<void> {
  assertOk(id ? await adminDb.from('videos').update(values).eq('id', id) : await adminDb.from('videos').insert(values));
}

export async function setVideoPublished(id: string, published: boolean): Promise<void> {
  assertOk(await adminDb.from('videos').update({ published }).eq('id', id));
}

export async function deleteVideo(id: string): Promise<void> {
  assertOk(await adminDb.from('videos').delete().eq('id', id));
}

export type AnnouncementValues = Pick<Announcement, 'title' | 'content' | 'published'>;

export async function listAnnouncements(): Promise<Announcement[]> {
  return unwrap(await adminDb.from('announcements').select('*').order('created_at', { ascending: false }));
}

export async function saveAnnouncement(id: string | null, values: AnnouncementValues): Promise<void> {
  assertOk(
    id
      ? await adminDb.from('announcements').update(values).eq('id', id)
      : await adminDb.from('announcements').insert(values),
  );
}

export async function setAnnouncementPublished(id: string, published: boolean): Promise<void> {
  assertOk(await adminDb.from('announcements').update({ published }).eq('id', id));
}

export async function deleteAnnouncement(id: string): Promise<void> {
  assertOk(await adminDb.from('announcements').delete().eq('id', id));
}

export interface RegistrationFilter {
  search: string;
  status: string;
}

function registrationQuery(filter: RegistrationFilter) {
  let query = adminDb.from('ppdb_registrations').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  const term = sanitizeSearchTerm(filter.search);
  if (term) {
    const pattern = `%${escapeLike(term)}%`;
    query = query.or(`student_name.ilike.${pattern},parent_name.ilike.${pattern},whatsapp.ilike.${pattern}`);
  }
  if (filter.status) query = query.eq('status', filter.status);
  return query;
}

export async function listRegistrations(filter: RegistrationFilter, page: number) {
  const from = page * REGISTRATIONS_PAGE_SIZE;
  const result = await registrationQuery(filter).range(from, from + REGISTRATIONS_PAGE_SIZE - 1);
  return { rows: unwrap(result), total: result.count ?? 0 };
}

export async function listAllRegistrations(filter: RegistrationFilter): Promise<Registration[]> {
  const batch = 1000;
  const all: Registration[] = [];
  for (let from = 0; ; from += batch) {
    const rows = unwrap(await registrationQuery(filter).range(from, from + batch - 1));
    all.push(...rows);
    if (rows.length < batch) return all;
  }
}

export async function setRegistrationStatus(id: string, status: RegistrationStatus): Promise<void> {
  assertOk(await adminDb.from('ppdb_registrations').update({ status }).eq('id', id));
}

export async function deleteRegistration(id: string): Promise<void> {
  assertOk(await adminDb.from('ppdb_registrations').delete().eq('id', id));
}
