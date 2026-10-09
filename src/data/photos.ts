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
  campus: definePhoto('school2', 1600, 900, 'Gedung SMP Sains Lombok Islamic School', 'SMP-SAINS'),

  lab: definePhoto('school3', 1400, 1050, 'dokumentasi', 'Dokumentasi Riset'),

  computerLab: definePhoto('school1', 1600, 900, 'program unggulan', 'Olimpiade Sains Nasional'),

  classroom: definePhoto('school4', 1400, 1050, 'dokumentasi', 'Sumatif Akhir Semester'),

  musalla: definePhoto('school5', 1400, 1050, 'dokumentasi', 'Ekstrakurikuler Karya Ilmiah'),

  library: definePhoto('school9', 1200, 1200, 'Our Teacher', 'Our Teacher'),

  robotics: definePhoto('school8', 1200, 1200, '-', 'Hari Kartini'),

  courtyard: definePhoto('school', 1200, 1200, '-', 'SMP SAINS'),
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
