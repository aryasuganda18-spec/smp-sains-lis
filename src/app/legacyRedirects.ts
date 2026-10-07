import { HOME_SECTIONS, ROUTES, homeSectionPath } from './routes';

export const LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  '/index.html': ROUTES.home,
  '/akademik.html': ROUTES.academics,
  '/galeri.html': ROUTES.gallery,
  '/berita.html': ROUTES.news,
  '/video.html': ROUTES.videos,
  '/pengumuman.html': ROUTES.announcements,
  '/kontak.html': ROUTES.contact,
  '/profil': homeSectionPath(HOME_SECTIONS.profile),
  '/profil.html': homeSectionPath(HOME_SECTIONS.profile),
  '/program': homeSectionPath(HOME_SECTIONS.programs),
  '/program.html': homeSectionPath(HOME_SECTIONS.programs),
  '/ppdb': homeSectionPath(HOME_SECTIONS.admissions),
  '/ppdb.html': homeSectionPath(HOME_SECTIONS.admissions),
};
