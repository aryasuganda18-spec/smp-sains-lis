import {
  BedDouble,
  BookOpenCheck,
  Bot,
  FlaskConical,
  Languages,
  Library,
  type LucideIcon,
  PartyPopper,
  School,
  Sigma,
  Trees,
} from 'lucide-react';
import { PHOTOS, type Photo } from './photos';

export const SCHOOL = {
  name: 'SMP Sains Lombok Islamic School',
  shortName: 'SMP SAINS',
  suffix: 'Lombok Islamic School',
  tagline: 'Sekolah sains terpadu berbasis IT di Lombok Barat',
  foundedYear: 2024,
} as const;

export const CONTACT = {
  phoneDisplay: '0851-1969-4411',
  whatsappId: '6285119694411',
  email: 'smpsainsoperator@gmail.com',
  address: 'Jl. Gora II, Pondok Buak, Batu Kumbung, Lingsar, Lombok Barat, NTB',
  region: 'Lombok Barat, Nusa Tenggara Barat',
  facebookUrl: 'https://www.facebook.com/people/Smpsains-Lis/61565657844961/',
  instagramUrl: 'https://www.instagram.com/smp.sains',
} as const;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SCHOOL.name}, ${CONTACT.address}`,
)}`;

export const WHATSAPP_MESSAGES = {
  inquiry: `Assalamu'alaikum, saya ingin bertanya soal PPDB ${SCHOOL.name}.`,
  registered: (parentName: string, studentName: string) =>
    `Assalamu'alaikum, saya ${parentName} sudah mengisi formulir PPDB ${SCHOOL.shortName} atas nama ${studentName}.`,
} as const;

export const PPDB = {
  academicYear: '',
  headline: 'Kuota angkatan baru terbatas.',
  lead: 'Isi formulir, atau chat admin. Kami kirim brosur, rincian biaya, dan jadwal tes.',
} as const;

export const PROFILE = {
  intro:
    'SMP Sains Lombok Islamic School menyelenggarakan pendidikan berbasis sains terapan. Siswa dilatih bereksperimen dan melakukan riset berbasis inquiry dan discovery.',
  quote: "Membentuk generasi saintis Muslim yang berkarakter Qur'ani dan berwawasan global.",
  vision:
    'Mewujudkan siswa yang mandiri, unggul dalam sains, berkarakter qur’ani, dan berwawasan global.',
  missions: [
    'Menyelenggarakan pembelajaran berbasis riset yang mandiri guna mendorong peserta didik berpikir kritis, memecahkan masalah kompleks, dan berinovasi di bidang IPTEK.',

    'Menyelenggarakan kegiatan ekstrakurikuler untuk memberikan ruang dan waktu kepada peserta didik dalam mengembangkan prestasi di bidang akademik maupun non-akademik.',

    "Menyelenggarakan program Tahsin dan Tahfidz dalam upaya membangun dan membentuk karakter Qur'ani.",

    "Menerapkan pembelajaran yang terintegrasi dengan kajian Islami yang bersumber dari Al-Qur'an dan Hadis.",

    'Menyelenggarakan proses pembelajaran menggunakan tiga bahasa untuk mengembangkan keterampilan berbahasa peserta didik.',

    'Menerapkan pembelajaran berbasis proyek yang berfokus pada isu-isu global, seperti keberlanjutan lingkungan dan kemanusiaan, untuk menguatkan kemampuan dan kemandirian peserta didik.',

    'Menyelenggarakan pembelajaran berbasis teknologi informasi (IT) untuk menambah wawasan dan meningkatkan keterampilan digital peserta didik.',

    'Menyelenggarakan pembelajaran berbasis digital yang terintegrasi pada setiap mata pelajaran.',
  ],
} as const;

export interface Highlight {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const HIGHLIGHTS: readonly Highlight[] = [
  {
    icon: FlaskConical,
    title: 'Sains terapan',
    text: 'Riset, inquiry, dan discovery di laboratorium.',
  },
  {
    icon: BookOpenCheck,
    title: "Karakter Qur'ani",
    text: "Nilai Al-Qur'an hadir dalam pembelajaran sehari-hari.",
  },
  { icon: Languages, title: 'Dua bahasa asing', text: 'Bahasa Inggris dan Bahasa Jepang.' },
  {
    icon: BedDouble,
    title: 'Asrama putra & putri',
    text: 'Asrama putra & putri terpisah, dengan pembina yang tinggal di asrama.',
  },
];

export interface Program {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const PROGRAMS: readonly Program[] = [
  {
    icon: Sigma,
    title: 'Olimpiade Sains dan Matematika',
    text: 'Program pembinaan bagi seluruh peserta didik di bidang sains dan matematika melalui pendalaman materi dan latihan soal untuk mempersiapkan mereka mengikuti kompetisi tingkat kabupaten hingga nasional.',
  },
  {
    icon: Languages,
    title: 'Bahasa Inggris',
    text: 'Program yang melatih peserta didik berbicara, mendengar, membaca, dan menulis dalam bahasa Inggris melalui kegiatan rutin seperti English Day agar terbiasa berkomunikasi dalam bahasa asing.',
  },
  {
    icon: Languages,
    title: 'Bahasa Jepang',
    text: 'Program pengenalan bahasa Jepang mulai dari huruf hiragana, katakana, kosakata dasar, hingga percakapan sederhana, sekaligus mengenalkan budaya Jepang kepada peserta didik.',
  },
  {
    icon: PartyPopper,
    title: 'Funday',
    text: 'Kegiatan rutin berisi permainan dan lomba yang mengajak peserta didik belajar sambil bermain dalam suasana menyenangkan dan penuh kebersamaan serta kegiatan outing class.',
  },
];

export const ACADEMICS = {
  title: 'Fasilitas yang dipakai, bukan dipajang.',
  lead: 'Pembelajaran yang berbasis riset dan experiment, di padukan dengan pembelajaran digital melalui perangkat seluler seperti hand phone, tablet, dan komputer.',
  curriculum:
    'Kurikulum nasional, di kombinasikan dengan sains terapan, tahfidz, dan zona bahasa Arab & Inggris. Praktikum lab dan project semester wajib.',
} as const;

export interface Facility {
  icon: LucideIcon;
  photo?: Photo;
  // Baris 'text: string;' dihapus agar tidak wajib diisi
}

export const FACILITIES: Facility[] = [
  { icon: School, photo: PHOTOS.classroom },
  { icon: FlaskConical, photo: PHOTOS.lab },
  { icon: School, photo: PHOTOS.library },
  { icon: Bot, photo: PHOTOS.musalla },
];

export const ADMISSION_STEPS = [
  {
    title: 'Isi formulir',
    text: 'Lengkapi data calon siswa dan orang tua lewat formulir pendaftaran.',
  },
  {
    title: 'Jadwal tes & wawancara',
    text: 'Admin menghubungi melalui nomor WhatsApp yang di daftarkan untuk mengatur jadwal.',
  },
  {
    title: 'Pengumuman & daftar ulang',
    text: 'Hasil dan rincian biaya disampaikan langsung ke orang tua.',
  },
] as const;

export const FAQ = [
  {
    question: `PPDB ${PPDB.academicYear} dibuka kapan?`,
    answer:
      'Gelombang 1 dibuka September–November 2026. Kuota per angkatan terbatas. Isi formulir pendaftaran di beranda atau hubungi admin lewat WhatsApp untuk jadwal tes.',
  },
  {
    question: 'Apakah ada asrama?',
    answer:
      'Ada. Asrama putra dan putri terpisah, dengan pembina yang tinggal di kampus. Siswa non-asrama diterima dengan radius tempuh yang disepakati saat wawancara.',
  },
  {
    question: 'Kurikulum yang dipakai apa?',
    answer: ACADEMICS.curriculum,
  },
  {
    question: 'Berapa biaya masuknya?',
    answer:
      'Rincian uang pangkal, SPP, dan asrama disampaikan saat sesi informasi atau lewat admin. Kami tidak memasang angka di situs supaya orang tua mendapat rincian yang berlaku untuk gelombang berjalan.',
  },
] as const;

export const ARTICLE_CATEGORIES = ['Umum', 'Akademik', 'Prestasi', 'Kegiatan', 'PPDB'] as const;
