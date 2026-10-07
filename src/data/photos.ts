const imageUrls = import.meta.glob<string>('../assets/images/*.{webp,jpeg,jpg,png}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const findImage = (file: string): string => {
  const extensions = ['webp', 'jpeg', 'jpg', 'png'];

  for (const ext of extensions) {
    const path = `../assets/images/${file}.${ext}`;
    const url = imageUrls[path];

    if (url) {
      return url;
    }
  }

  return '';
};

export interface Photo {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

function definePhoto(
  file: string,
  width: number,
  height: number,
  alt: string,
  caption: string,
): Photo {
  const mainUrl = findImage(file);
  const smallUrl = findImage(`${file}-sm`);

  return {
    src: mainUrl,
    srcSet: smallUrl ? `${smallUrl} 640w, ${mainUrl} ${width}w` : `${mainUrl} ${width}w`,
    width,
    height,
    alt,
    caption,
  };
}

export const LOGO_URL = findImage('logo');

export const PHOTOS = {
  campus: definePhoto('school2', 1600, 900, 'Gedung SMP Sains Lombok Islamic School', 'siswa top'),

  lab: definePhoto(
    'lab',
    1400,
    1050,
    'Laboratorium sains dengan alat gelas dan mikroskop',
    'Lab sains',
  ),

  computerLab: definePhoto(
    'computer-lab',
    1600,
    900,
    'Laboratorium komputer dengan deretan monitor',
    'Lab komputer',
  ),

  classroom: definePhoto(
    'classroom',
    1400,
    1050,
    'Ruang kelas dengan meja kayu dan papan digital',
    'Ruang kelas',
  ),

  musalla: definePhoto(
    'musalla',
    1400,
    1050,
    'Musalla sekolah dengan sajadah hijau rapi',
    'Musalla',
  ),

  library: definePhoto(
    'library',
    1200,
    1200,
    'Lorong perpustakaan dengan rak kayu dan lampu hangat',
    'Perpustakaan',
  ),

  robotics: definePhoto(
    'robot',
    1200,
    1200,
    'Sasis robot edukasi dan papan Arduino di meja bengkel',
    'Bengkel robotik',
  ),

  courtyard: definePhoto(
    'school3',
    1200,
    1200,
    'Halaman dalam dengan lantai geometris dan sayap kelas',
    'Halaman dalam',
  ),
} as const satisfies Record<string, Photo>;

export const CAMPUS_GALLERY: readonly Photo[] = [
  PHOTOS.campus,
  PHOTOS.lab,
  PHOTOS.computerLab,
  PHOTOS.classroom,
  PHOTOS.musalla,
  PHOTOS.library,
  PHOTOS.robotics,
  PHOTOS.courtyard,
];

export const toGridPhoto = (key: string, photo: Photo) => ({
  key,
  src: photo.src,
  srcSet: photo.srcSet,
  width: photo.width,
  height: photo.height,
  alt: photo.alt,
  caption: photo.caption,
});
