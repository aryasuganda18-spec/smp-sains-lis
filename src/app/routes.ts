export const ROUTES = {
  home: '/',
  academics: '/akademik',
  gallery: '/galeri',
  news: '/berita',
  videos: '/video',
  announcements: '/pengumuman',
  contact: '/kontak',
  admin: '/admin',
} as const;

export const HOME_SECTIONS = {
  profile: 'profil',
  vision: 'visi-misi',
  programs: 'program',
  admissions: 'ppdb',
  form: 'form-pendaftaran',
} as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[keyof typeof HOME_SECTIONS];

export const homeSectionPath = (id: HomeSectionId) => `${ROUTES.home}#${id}`;
export const albumPath = (id: string) => `${ROUTES.gallery}/${encodeURIComponent(id)}`;
export const articlePath = (slug: string) => `${ROUTES.news}/${encodeURIComponent(slug)}`;

export const ADMIN_ROUTES = {
  login: '/admin/masuk',
  dashboard: '/admin',
  articles: '/admin/artikel',
  newArticle: '/admin/artikel/baru',
  albums: '/admin/galeri',
  videos: '/admin/video',
  announcements: '/admin/pengumuman',
  registrations: '/admin/pendaftar',
} as const;

export const adminArticlePath = (id: string) => `${ADMIN_ROUTES.articles}/${encodeURIComponent(id)}`;
export const adminAlbumPath = (id: string) => `${ADMIN_ROUTES.albums}/${encodeURIComponent(id)}`;
