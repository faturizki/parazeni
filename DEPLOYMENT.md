# Deployment

Panduan ini menjelaskan langkah deploy aplikasi `KARYO OS` dan migration Supabase.

## Prasyarat

- Node.js >= 20
- npm >= 10
- Akun Supabase dengan project terpasang
- `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
- GitHub repository dengan workflow deploy di `.github/workflows/deploy-production.yml`

## Environment Variables

Buat file `.env.local` di root project dengan isi:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_APP_NAME=Karyo OS
VITE_APP_VERSION=1.5.0
```

Untuk beberapa skrip deployment optional, Anda juga dapat menambahkan:

```env
SUPABASE_PROJECT_REF=<project-ref>
SUPABASE_ACCESS_TOKEN=<supabase-access-token>
```

## Deploy lengkap (direkomendasikan)

Jalankan setup lengkap berikut dari root project:

```bash
bash scripts/setup.sh
```

Langkah ini akan:

1. Menginstall dependency dengan `npm ci`
2. Menghasilkan `.env.local`
3. Login ke Supabase
4. Link ke project Supabase Anda
5. Jalankan migrasi dengan `supabase db push`
6. Build proyek dengan `npm run build`

## Deploy migrasi Supabase saja

Jika Anda sudah memiliki `.env.local` dan ingin hanya menjalankan migrasi:

```bash
npm run sync:supabase
```

Atau jika Anda ingin menjalankan script deploy terminal:

```bash
bash scripts/deploy.sh
```

Script ini akan:

- pastikan `node` dan `.env.local` tersedia
- link Supabase project jika belum
- jalankan `supabase db push`
- jalankan `npm run build`

## Build production

```bash
npm run build
```

Build produksi akan menempatkan hasil di folder `dist/`.

## Deploy frontend ke GitHub Pages

Frontend deploy ke GitHub Pages ditangani oleh workflow berikut:

- `.github/workflows/deploy-production.yml`

Workflow akan:

1. checkout source code
2. install dependency dengan `npm ci`
3. resolve base path GitHub Pages secara otomatis
4. build production dengan variabel `VITE_BASE_PATH`
5. salin `public/404.html` ke `dist/404.html`
6. upload artifact ke Pages

Untuk menjalankan deploy manual, push ke branch `main` atau gunakan `workflow_dispatch` pada halaman Actions.

## GitHub Actions secrets

Tambahkan secret berikut di repo GitHub:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Jika Anda menggunakan GitHub vars sebagai alternatif, workflow juga dapat membaca vars tersebut.

## Verifikasi deploy

Setelah deploy, periksa:

- Build `npm run build` berjalan sukses
- Folder `dist/` berisi aset produksi
- `public/404.html` disalin ke `dist/404.html`
- GitHub Pages berhasil deploy tanpa error HTML/JavaScript

## Tips

- Untuk melihat status migration Supabase, gunakan `supabase migration list`
- Jika perubahan schema tidak muncul, jalankan kembali `npm run sync:supabase`
- GitHub Pages base path ditentukan otomatis oleh workflow, sehingga tidak perlu mengatur `VITE_BASE_PATH` secara manual pada umumnya
