import { HOME_SECTIONS, ROUTES, homeSectionPath } from '@/app/routes';

export interface NavLeaf {
  label: string;
  to: string;
  hint?: string;
}

export interface NavGroup {
  label: string;
  items: readonly NavLeaf[];
}

export type NavEntry = NavLeaf | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => 'items' in entry;

export const NAV: readonly NavEntry[] = [
  {
    label: 'Profil',
    items: [
      { label: 'Tentang sekolah', to: homeSectionPath(HOME_SECTIONS.profile), hint: 'Siapa kami' },
      { label: 'Visi & misi', to: homeSectionPath(HOME_SECTIONS.vision), hint: 'Arah dan tujuan' },
    ],
  },
  { label: 'Program', to: homeSectionPath(HOME_SECTIONS.programs) },
  { label: 'Akademik', to: ROUTES.academics },
  { label: 'Galeri', to: ROUTES.gallery },
  {
    label: 'Informasi',
    items: [
      { label: 'Berita', to: ROUTES.news, hint: 'Kabar dari sekolah' },
      { label: 'Pengumuman', to: ROUTES.announcements, hint: 'Info penting untuk orang tua' },
      { label: 'Video', to: ROUTES.videos, hint: 'Dokumentasi kegiatan' },
    ],
  },
  { label: 'Kontak', to: ROUTES.contact },
];

export const ADMISSION_LINK: NavLeaf = {
  label: 'Daftar PPDB',
  to: homeSectionPath(HOME_SECTIONS.admissions),
};

export const FOOTER_COLUMNS: readonly { title: string; links: readonly NavLeaf[] }[] = [
  {
    title: 'Sekolah',
    links: [
      { label: 'Tentang sekolah', to: homeSectionPath(HOME_SECTIONS.profile) },
      { label: 'Visi & misi', to: homeSectionPath(HOME_SECTIONS.vision) },
      { label: 'Program', to: homeSectionPath(HOME_SECTIONS.programs) },
      { label: 'Akademik', to: ROUTES.academics },
      { label: 'Galeri', to: ROUTES.gallery },
      ADMISSION_LINK,
    ],
  },
  {
    title: 'Informasi',
    links: [
      { label: 'Berita', to: ROUTES.news },
      { label: 'Pengumuman', to: ROUTES.announcements },
      { label: 'Video', to: ROUTES.videos },
      { label: 'Kontak', to: ROUTES.contact },
    ],
  },
];

export function collectNavLinks(): NavLeaf[] {
  const fromNav = NAV.flatMap((entry) => (isNavGroup(entry) ? [...entry.items] : [entry]));
  const fromFooter = FOOTER_COLUMNS.flatMap((column) => [...column.links]);
  return [...fromNav, ADMISSION_LINK, ...fromFooter];
}

export function isLeafActive(leaf: NavLeaf, pathname: string): boolean {
  if (leaf.to.includes('#')) return false;
  return leaf.to === '/' ? pathname === '/' : pathname === leaf.to || pathname.startsWith(`${leaf.to}/`);
}
