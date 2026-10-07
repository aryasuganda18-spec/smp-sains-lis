# SMP Sains Lombok Islamic School — Situs Web

Situs sekolah dengan halaman publik (beranda, akademik, galeri, berita, video, pengumuman, kontak, formulir PPDB) dan panel admin (`/admin`). Dibangun dengan React + TypeScript + Vite; data memakai Supabase.

## Menjalankan

Butuh Node.js 22.18 atau lebih baru.

```bash
npm install
cp .env.example .env     # isi URL dan kunci publishable Supabase
npm run dev              # http://localhost:5173
```

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | server pengembangan |
| `npm run build` | cek tipe + build produksi ke `dist/` |
| `npm run preview` | menjalankan hasil build secara lokal |
| `npm run check` | typecheck, lint, dan tes otomatis |
| `npm run sync:vercel` | membuat ulang `vercel.json` dari `config/security.ts` |

Kunci `VITE_SUPABASE_PUBLISHABLE_KEY` memang publik. Jangan pernah memasukkan `service_role` atau kunci rahasia lain ke proyek ini.

## Struktur

```
config/security.ts      satu-satunya sumber CSP dan header keamanan
supabase/security.sql   hardening database (dijalankan manual, lihat bagian Keamanan)
src/
  app/                  router, daftar rute, redirect URL lama
  data/                 teks sekolah (site.ts), menu (navigation.ts), foto (photos.ts)
  components/           layout (header, menu mobile, footer) dan elemen UI umum
  features/             PPDB, galeri/lightbox, berita, video
  pages/                halaman publik
  admin/                panel admin (dimuat terpisah, hanya saat /admin dibuka)
  lib/                  fungsi bantu: sanitasi HTML, format, YouTube, WhatsApp, CSV, gambar
  styles/               tokens.css (warna, font, jarak), base.css, layout.css, components.css, pages.css
```

## Mengubah isi

- **Teks sekolah** (profil, visi-misi, program, fasilitas, FAQ, kontak, tahun PPDB): `src/data/site.ts`.
- **Menu dan footer**: `src/data/navigation.ts`. Tes `navigation.test.tsx` memastikan semua tautan menuju halaman atau anchor yang ada.
- **Foto bawaan**: taruh berkas `.webp` di `src/assets/images/` dan daftarkan di `src/data/photos.ts` (sertakan versi `-sm` selebar 640 px).
- **Warna dan font**: `src/styles/tokens.css`. Font ditanam lokal lewat paket `@fontsource`.
- **Berita, album, video, pengumuman**: lewat panel admin, tidak perlu mengubah kode.

## Panel admin

Alamat `/admin`. Login memakai akun Supabase Auth yang juga terdaftar di tabel `admin_profiles`. Fitur: ringkasan, artikel (editor teks kaya, sampul, draf/terbit), album dan foto (unggah banyak, keterangan, sampul), video, pengumuman, dan pendaftar PPDB (cari, filter, ubah status, tautan WhatsApp, ekspor CSV).

Menambah admin: buat pengguna di Supabase Dashboard → Authentication → Users, lalu tambahkan barisnya ke `admin_profiles` dengan `id` yang sama.

## Keamanan

Pemeriksaan admin di antarmuka hanya kenyamanan. Batas keamanan sebenarnya adalah Row Level Security di database.

1. Jalankan `supabase/security.sql` di Supabase Dashboard → SQL Editor. Berkas ini membuat fungsi `is_admin()`, mengganti semua policy supaya penulisan hanya untuk akun yang ada di `admin_profiles`, mempersempit hak akses `anon`, memberi batas panjang data, membatasi tipe dan ukuran file bucket `cms-media`, serta membatasi pendaftaran berulang dari satu nomor (5 per jam). Berkas ini juga menghapus fungsi `get_dashboard_stats` yang tidak lagi dipakai.
2. Di Dashboard → Authentication → Sign In / Providers, matikan **Allow new users to sign up**.
3. Di Authentication → Password security, aktifkan **Leaked password protection**.
4. Gunakan kata sandi admin yang panjang dan unik.

Perlindungan di sisi aplikasi: CSP ketat tanpa script atau style inline, isi artikel disanitasi dengan DOMPurify, tautan video wajib `https`, gambar dikompres ulang di browser (metadata GPS ikut terhapus), nama file unggahan acak, ekspor CSV menetralkan rumus spreadsheet, input pencarian disaring sebelum dipakai sebagai filter.

## Deploy

Jalankan `npm run build`, lalu unggah isi `dist/`. Semua alamat harus jatuh ke `index.html`.

- **Netlify**: sudah siap. `_headers` (header keamanan) dan `_redirects` ikut terbawa dari build.
- **Vercel**: `vercel.json` sudah disertakan. Setelah mengganti `VITE_SUPABASE_URL`, jalankan `npm run sync:vercel`; tes otomatis akan gagal bila berkas ini tidak sinkron.
- **Apache / hosting cPanel**: `.htaccess` ikut dibuat di `dist/` (butuh `mod_headers` dan `mod_rewrite`).
- **GitHub Pages**: isi `VITE_BASE_PATH=/nama-repo/` sebelum build. Berkas `404.html` sudah dibuat sebagai fallback rute. Hosting ini tidak bisa memasang header HTTP, sehingga CSP hanya berlaku lewat tag meta (tanpa `frame-ancestors`).

## URL lama

Tautan dari situs sebelumnya dialihkan otomatis: `/index.html`, `/akademik.html`, `/galeri.html`, `/berita.html`, `/video.html`, `/pengumuman.html`, `/kontak.html`, `/profil.html`, `/program.html`, `/ppdb.html`, `/berita-detail.html?slug=…`, dan `/galeri-album.html?id=…`.

## Pengujian

`npm run check` menjalankan typecheck, lint, dan tes unit/komponen (navigasi, formulir PPDB, lightbox, CSP, sanitasi HTML, fungsi bantu).
