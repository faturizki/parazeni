# Getting Started

Panduan ini menjelaskan langkah-langkah untuk menyiapkan lingkungan development aplikasi `KARYO OS`.

## Prasyarat

- Node.js >= 20
- npm >= 10
- Git
- Akun Supabase
- akses internet untuk Supabase dan package registry

## Setup cepat

```bash
git clone https://github.com/vetocatprotocol-web/zenipara.git
cd zenipara
bash scripts/setup.sh
npm run dev
```

`bash scripts/setup.sh` akan melakukan:

- install dependency dengan `npm ci`
- membuat file `.env.local`
- meminta `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
- login Supabase dan link project
- menjalankan migrasi Supabase (`supabase db push`)
- build proyek awal dengan `npm run build`

Setelah selesai, buka `http://localhost:5173`.

## Setup manual

### 1. Install dependency

```bash
npm ci
```

### 2. Buat `.env.local`

```bash
cp .env.example .env.local
```

Kemudian tambahkan nilai:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_APP_NAME=Karyo OS
VITE_APP_VERSION=1.5.0
```

### 3. Verifikasi Supabase

```bash
npm run check:supabase
```

Jika Anda belum memasang Supabase CLI, script akan menggunakan `npm exec --yes supabase@latest --`.

### 4. Jalankan development server

```bash
npm run dev
```

### 5. Opsi tambahan

```bash
npm run dev:offline      # Jalankan tanpa Supabase env
npm run lint             # Jalankan ESLint
npm run type-check       # Jalankan TypeScript check
npm run test:unit        # Jalankan unit test
npm run test:e2e         # Jalankan E2E test
```

## Migrasi Supabase

Jika Anda hanya perlu menyinkronkan migration dengan project Supabase:

```bash
npm run sync:supabase
```

## Deploy lokal untuk preview

```bash
npm run build
npm run preview
```

## Referensi

- `bash scripts/setup.sh` — setup penuh development
- `bash scripts/sync-supabase.sh` — sinkronisasi migration Supabase
- `bash scripts/deploy.sh` — build produksi + migrasi Supabase
- `npm run check:supabase` — verifikasi koneksi Supabase
