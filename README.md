# KARYO OS

**KARYO OS** adalah aplikasi web frontend React + Supabase untuk manajemen operasional personel militer dengan role-based access, gate pass, absensi, logistik, dan dashboard peran.

Repository ini berada dalam project `zenipara`.

![Version](https://img.shields.io/badge/version-1.5.0-blue)

---

## 🚀 Ringkasan

- Frontend: **React 19 + TypeScript + Vite 6 + Tailwind CSS 4**
- Backend: **Supabase** (PostgreSQL + Auth + Realtime)
- Akses per role: `admin`, `komandan`, `staf`, `guard`, `prajurit`
- Build produksi: `npm run build`
- Deploy frontend: GitHub Pages via workflow `.github/workflows/deploy-production.yml`

---

## 📦 Persiapan cepat

```bash
git clone https://github.com/vetocatprotocol-web/zenipara.git
cd zenipara
bash scripts/setup.sh
npm run dev
```

Akses aplikasi di: `http://localhost:5173`

---

## 📚 Dokumentasi penting

- [GETTING_STARTED.md](./GETTING_STARTED.md) — setup development dan skrip utama
- [DEPLOYMENT.md](./DEPLOYMENT.md) — deploy production dan GitHub Pages
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — solusi masalah umum
- [CONTRIBUTING.md](./CONTRIBUTING.md) — panduan kontribusi
- [CHANGELOG.md](./CHANGELOG.md) — riwayat rilis
- [FEATURES.md](./FEATURES.md) — daftar fitur dan peran

---

## 🧰 Perintah penting

```bash
npm run dev            # Jalankan development server
npm run dev:offline    # Jalankan dev server tanpa Supabase env
npm run build          # Build production
npm run preview        # Preview build production
npm run lint           # ESLint check
npm run type-check     # TypeScript check
npm run test           # Jalankan semua test Vitest
npm run test:unit      # Unit test
npm run test:e2e       # E2E test (Vitest pages)
npm run sync:supabase  # Sinkronisasi migration Supabase
npm run check:supabase # Verifikasi koneksi Supabase
bash scripts/deploy.sh # Deploy migrasi Supabase + build frontend
```

---

## 📁 Struktur proyek

```
zenipara/
├── .github/workflows/      # CI / deploy workflow
├── e2e/                    # Playwright / E2E test specs
├── public/                 # Aset statis dan fallback 404
├── scripts/                # Setup, deploy, dan sync Supabase
├── src/                    # Sumber kode aplikasi
├── supabase/               # Migration SQL dan konfigurasi Supabase
├── .env.example            # Contoh env untuk frontend
├── package.json            # Skrip dan dependency
├── tsconfig.json           # TypeScript config
├── vite.config.js          # Vite config
└── README.md
```

---

## 📌 Catatan

- `bash scripts/setup.sh` adalah cara paling cepat untuk memulai; ia akan menyiapkan dependency, file `.env.local`, login Supabase, link project, migrasi DB, dan build awal.
- `bash scripts/deploy.sh` mem-build frontend dan menerapkan migration Supabase. Deploy frontend ke GitHub Pages dilakukan oleh workflow GitHub Actions.
- Hindari commit file `.env.local`.

---

## 📜 Lisensi

Lisensi diatur dalam file [LICENSE](./LICENSE).
