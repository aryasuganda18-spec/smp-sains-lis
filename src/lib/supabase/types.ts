import type { Database } from './database.types';

type Tables = Database['public']['Tables'];

export type Article = Tables['articles']['Row'];
export type ArticleInsert = Tables['articles']['Insert'];
export type ArticleUpdate = Tables['articles']['Update'];
export type Album = Tables['albums']['Row'];
export type AlbumSummary = Pick<Album, 'id' | 'title' | 'description' | 'cover_image_url'>;
export type GalleryPhoto = Tables['gallery_photos']['Row'];
export type Video = Tables['videos']['Row'];
export type Announcement = Tables['announcements']['Row'];
export type Registration = Tables['ppdb_registrations']['Row'];
export type RegistrationInsert = Tables['ppdb_registrations']['Insert'];

export const REGISTRATION_STATUSES = ['baru', 'dihubungi', 'diterima', 'ditolak'] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export const ARTICLE_STATUSES = ['draft', 'published'] as const;
