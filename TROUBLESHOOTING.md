# Troubleshooting

Dokumentasi ini membantu menyelesaikan masalah umum saat menjalankan `KARYO OS`.

## 1. Instalasi & setup

### `npm ci` gagal

```bash
npm cache clean --force
npm ci
```

Jika masih gagal, pastikan:

- Node.js versi 20+ terpasang
- `package-lock.json` ada di root
- koneksi internet stabil

### `bash scripts/setup.sh` berhenti di step Supabase login

Script `setup.sh` meminta login Supabase. Jika Anda tidak bisa login via browser, gunakan:

```bash
npm exec --yes supabase@latest login
```

Kemudian jalankan ulang `bash scripts/setup.sh`.

## 2. Environment variables

### `.env.local` tidak ditemukan

Buat file dari contoh:

```bash
cp .env.example .env.local
```

Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dengan nilai Supabase yang valid.

### `npm run check:supabase` error

Periksa kembali nilai di `.env.local`:

- `VITE_SUPABASE_URL` harus berbentuk `https://<project-ref>.supabase.co`
- `VITE_SUPABASE_ANON_KEY` harus kunci anon public

Jika masih error, coba jalankan:

```bash
npm run check:supabase
```

Output akan mengindikasikan apakah endpoint Supabase reachable.

## 3. Supabase migration

### `supabase db push` gagal

- Pastikan `SUPABASE_PROJECT_REF` tersedia di `.env.local` atau melalui login Supabase
- Pastikan Anda sudah login dengan `supabase login`
- Jalankan `npm run sync:supabase`

Jika Anda menggunakan Supabase CLI dari npm, command akan tetap berjalan.

### `supabase project is not linked`

Pastikan project sudah link dengan:

```bash
supabase link --project-ref <project-ref>
```

Atau jalankan `bash scripts/deploy.sh` yang akan menanyakan project ID bila belum ter-link.

## 4. Build & runtime

### `npm run build` gagal

Jalankan terlebih dahulu:

```bash
npm run type-check
npm run lint
```

Perbaiki error TypeScript dan ESLint yang tampil sebelum build.

### Halaman kosong di browser setelah build

- Pastikan Anda menggunakan `npm run preview` dari folder root
- Jika menggunakan GitHub Pages, pastikan assets `dist/404.html` ada dan base path sudah ditetapkan oleh workflow

### `Cannot find module '@/...'

Verifikasi bahwa `tsconfig.json` masih memiliki alias:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

Jika benar, restart dev server.

## 5. GitHub Pages & deploy

### Deploy tidak terjadi setelah push

- Pastikan branch `main` adalah branch target deploy
- Periksa halaman Actions di GitHub: workflow `deploy-production` harus berhasil
- Pastikan secrets `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sudah diatur

### Halaman GitHub Pages menampilkan 404 atau blank page

- Workflow deploy produksi mengatur `VITE_BASE_PATH` secara otomatis
- Pastikan `dist/404.html` tersedia karena SPA fallback
- Jika error di browser konsol, buka `Network` untuk melihat asset yang gagal dimuat

## 6. Hal umum

### Port 5173 sudah digunakan

```bash
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Inisialisasi ulang project

Jika repositori tidak konsisten setelah update, jalankan:

```bash
rm -rf node_modules dist
npm ci
bash scripts/setup.sh
```

### Scripts yang tersedia

- `bash scripts/setup.sh` — setup development lengkap
- `bash scripts/deploy.sh` — migrasi Supabase + build frontend
- `npm run sync:supabase` — sinkronisasi migrasi
- `npm run check:supabase` — verifikasi koneksi Supabase

Jika Anda masih mengalami masalah, buka issue di repository atau lihat log Actions untuk detail kegagalan.
