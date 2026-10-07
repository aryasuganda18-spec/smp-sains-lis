const imageUrls = import.meta.glob<string>('../assets/images/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
});

const urlOf = (file: string): string => imageUrls[`../assets/images/${file}.webp`] ?? '';

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
  return {
    src: urlOf(file),
    srcSet: `${urlOf(`${file}-sm`)} 640w, ${urlOf(file)} ${width}w`,
    width,
    height,
    alt,
    caption,
  };
}

export const LOGO_URL = urlOf('logo');

export const PHOTOS = {
  campus: definePhoto('campus-dusk', 1600, 900, 'Fasad kampus saat senja dengan kolam pantul dan pepohonan tropis', 'Kampus sekolah'),
  lab: definePhoto('lab', 1400, 1050, 'Laboratorium sains dengan alat gelas dan mikroskop', 'Lab sains'),
  computerLab: definePhoto('computer-lab', 1600, 900, 'Laboratorium komputer dengan deretan monitor', 'Lab komputer'),
  classroom: definePhoto('classroom', 1400, 1050, 'Ruang kelas dengan meja kayu dan papan digital', 'Ruang kelas'),
  musalla: definePhoto('musalla', 1400, 1050, 'Musalla sekolah dengan sajadah hijau rapi', 'Musalla'),
  library: definePhoto('library', 1200, 1200, 'Lorong perpustakaan dengan rak kayu dan lampu hangat', 'Perpustakaan'),
  robotics: definePhoto('robot', 1200, 1200, 'Sasis robot edukasi dan papan Arduino di meja bengkel', 'Bengkel robotik'),
  courtyard: definePhoto('courtyard', 1200, 1200, 'Halaman dalam dengan lantai geometris dan sayap kelas', 'Halaman dalam'),
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
