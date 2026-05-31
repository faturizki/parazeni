BEGIN;

-- ============================================================
-- FASE 2 — DATABASE MIGRATION: Explicit Roles, User Hierarchy, and New Modules
-- ============================================================

-- A. Add kompi_id / peleton_id to users and ensure indexes.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS kompi_id UUID REFERENCES public.satuans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS peleton_id UUID REFERENCES public.satuans(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_kompi_id ON public.users(kompi_id);
CREATE INDEX IF NOT EXISTS idx_users_peleton_id ON public.users(peleton_id);

-- B. Add explicit role values to enum or CHECK constraint.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type t
    WHERE t.typname = 'user_role'
      AND t.typtype = 'e'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'user_role'
        AND e.enumlabel = 'command_level'
    ) THEN
      ALTER TYPE public.user_role ADD VALUE 'command_level';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'user_role'
        AND e.enumlabel = 'staff_ops'
    ) THEN
      ALTER TYPE public.user_role ADD VALUE 'staff_ops';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'user_role'
        AND e.enumlabel = 'staff_pers'
    ) THEN
      ALTER TYPE public.user_role ADD VALUE 'staff_pers';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'user_role'
        AND e.enumlabel = 'staff_log'
    ) THEN
      ALTER TYPE public.user_role ADD VALUE 'staff_log';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'user_role'
        AND e.enumlabel = 'unit_leader'
    ) THEN
      ALTER TYPE public.user_role ADD VALUE 'unit_leader';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'user_role'
        AND e.enumlabel = 'field_officer'
    ) THEN
      ALTER TYPE public.user_role ADD VALUE 'field_officer';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'user_role'
        AND e.enumlabel = 'anggota'
    ) THEN
      ALTER TYPE public.user_role ADD VALUE 'anggota';
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
  ALTER TABLE public.users
    ADD CONSTRAINT users_role_check CHECK (role IN (
      'super_admin',
      'admin_satuan',
      'command_level',
      'komandan',
      'staff_ops',
      'staff_pers',
      'staff_log',
      'staff_satuan',
      'unit_leader',
      'field_officer',
      'anggota',
      'prajurit',
      'guard'
    ));
END $$;

-- C. Migrate legacy roles to the new explicit role set.
UPDATE public.users
SET role = 'anggota'
WHERE role IN ('prajurit');

UPDATE public.users
SET role = 'command_level'
WHERE role = 'komandan' AND level_komando = 'BATALION';

UPDATE public.users
SET role = 'unit_leader'
WHERE role = 'komandan' AND level_komando = 'KOMPI';

UPDATE public.users
SET role = 'field_officer'
WHERE role = 'komandan' AND level_komando = 'PELETON';

UPDATE public.users
SET role = 'staff_pers'
WHERE role IN ('staff_satuan', 'staf')
  AND (jabatan ILIKE '%S-1%' OR jabatan ILIKE '%PERS%' OR jabatan ILIKE '%Pasi Pers%');

UPDATE public.users
SET role = 'staff_log'
WHERE role IN ('staff_satuan', 'staf')
  AND (jabatan ILIKE '%S-4%' OR jabatan ILIKE '%LOG%' OR jabatan ILIKE '%Pasi Log%');

UPDATE public.users
SET role = 'staff_ops'
WHERE role IN ('staff_satuan', 'staf')
  AND (jabatan ILIKE '%S-3%' OR jabatan ILIKE '%OPS%' OR jabatan ILIKE '%Pasi Ops%');

UPDATE public.users
SET role = 'staff_ops'
WHERE role IN ('staff_satuan', 'staf');

UPDATE public.users
SET role = 'super_admin'
WHERE role IN ('admin_satuan', 'admin');

UPDATE public.users
SET role = 'field_officer'
WHERE role = 'guard';

-- D. Add new helper functions for explicit role and command context.
CREATE OR REPLACE FUNCTION public.current_karyo_is_role(p_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT u.role = p_role
  FROM public.users u
  WHERE u.id = public.current_karyo_user_id()
    AND u.is_active = TRUE
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.current_karyo_is_any_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT u.role IN ('staff_ops', 'staff_pers', 'staff_log')
  FROM public.users u
  WHERE u.id = public.current_karyo_user_id()
    AND u.is_active = TRUE
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.current_karyo_kompi_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT u.kompi_id
  FROM public.users u
  WHERE u.id = public.current_karyo_user_id()
    AND u.is_active = TRUE
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.current_karyo_peleton_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT u.peleton_id
  FROM public.users u
  WHERE u.id = public.current_karyo_user_id()
    AND u.is_active = TRUE
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.current_karyo_is_role(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.current_karyo_is_any_staff() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.current_karyo_kompi_id() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.current_karyo_peleton_id() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_session_context(
  p_user_id UUID,
  p_role TEXT,
  p_satuan_id UUID DEFAULT NULL,
  p_kompi_id UUID DEFAULT NULL,
  p_peleton_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM set_config('karyo.current_user_id', COALESCE(p_user_id::text, ''), TRUE);
  PERFORM set_config('karyo.current_user_role', COALESCE(p_role, ''), TRUE);
  PERFORM set_config('karyo.current_satuan_id', COALESCE(p_satuan_id::text, ''), TRUE);
  PERFORM set_config('karyo.current_kompi_id', COALESCE(p_kompi_id::text, ''), TRUE);
  PERFORM set_config('karyo.current_peleton_id', COALESCE(p_peleton_id::text, ''), TRUE);
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_session_context(UUID, TEXT, UUID, UUID, UUID) TO anon;

CREATE OR REPLACE FUNCTION public.verify_user_pin(p_nrp TEXT, p_pin TEXT)
RETURNS TABLE (
  user_id UUID,
  user_role TEXT,
  force_change_pin BOOLEAN,
  satuan_id UUID,
  kompi_id UUID,
  peleton_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user public.users%ROWTYPE;
BEGIN
  SELECT *
  INTO v_user
  FROM public.users
  WHERE nrp = p_nrp
    AND is_active = TRUE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF v_user.locked_until IS NOT NULL AND v_user.locked_until > NOW() THEN
    RETURN;
  END IF;

  IF v_user.pin_hash = extensions.crypt(p_pin, v_user.pin_hash) THEN
    user_id := v_user.id;
    user_role := v_user.role;
    force_change_pin := COALESCE(v_user.force_change_pin, FALSE);
    satuan_id := v_user.satuan_id;
    kompi_id := v_user.kompi_id;
    peleton_id := v_user.peleton_id;

    UPDATE public.users
    SET login_attempts = 0,
        locked_until = NULL,
        updated_at = NOW()
    WHERE id = v_user.id;

    RETURN NEXT;
  END IF;

  PERFORM public.increment_login_attempts(p_nrp);
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_user_pin(TEXT, TEXT) TO anon;

-- E. New tables for Staff Ops / Field Officer workflow.
CREATE TABLE IF NOT EXISTS public.kalatlap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  satuan_id UUID NOT NULL REFERENCES public.satuans(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  jenis_latihan TEXT NOT NULL CHECK (jenis_latihan IN ('konstruksi', 'ranjau', 'jembatan', 'tempur', 'administrasi', 'lainnya')),
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  lokasi VARCHAR(255),
  keterangan TEXT,
  dibuat_oleh UUID REFERENCES public.users(id) ON DELETE SET NULL,
  klasifikasi TEXT NOT NULL DEFAULT 'terbuka' CHECK (klasifikasi IN ('terbuka', 'terbatas', 'rahasia')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.penugasan_lapangan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  satuan_id UUID NOT NULL REFERENCES public.satuans(id) ON DELETE CASCADE,
  kompi_id UUID REFERENCES public.satuans(id) ON DELETE SET NULL,
  kalatlap_id UUID REFERENCES public.kalatlap(id) ON DELETE SET NULL,
  judul_tugas VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  peleton_ids UUID[],
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'aktif', 'selesai', 'dibatalkan')),
  dibuat_oleh_danki UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.laporan_kemajuan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  penugasan_id UUID NOT NULL REFERENCES public.penugasan_lapangan(id) ON DELETE CASCADE,
  satuan_id UUID NOT NULL REFERENCES public.satuans(id) ON DELETE CASCADE,
  peleton_id UUID REFERENCES public.satuans(id) ON DELETE SET NULL,
  danton_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  persentase_selesai INTEGER NOT NULL DEFAULT 0 CHECK (persentase_selesai BETWEEN 0 AND 100),
  deskripsi_kemajuan TEXT NOT NULL,
  foto_urls TEXT[],
  kendala TEXT,
  tanggal_laporan DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- F. New tables for Staff Log workflow.
CREATE TABLE IF NOT EXISTS public.inventaris_almatzi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  satuan_id UUID NOT NULL REFERENCES public.satuans(id) ON DELETE CASCADE,
  kode_barang VARCHAR(50),
  nama_barang VARCHAR(255) NOT NULL,
  kategori TEXT NOT NULL CHECK (kategori IN ('senjata', 'amunisi', 'alat_berat', 'kendaraan', 'bahan_bakar', 'perlengkapan')),
  jumlah_total INTEGER NOT NULL DEFAULT 0,
  jumlah_siap_pakai INTEGER NOT NULL DEFAULT 0,
  jumlah_rusak INTEGER NOT NULL DEFAULT 0,
  satuan_ukur VARCHAR(50) NOT NULL DEFAULT 'unit',
  nomor_seri VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.jadwal_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventaris_id UUID NOT NULL REFERENCES public.inventaris_almatzi(id) ON DELETE CASCADE,
  satuan_id UUID NOT NULL REFERENCES public.satuans(id) ON DELETE CASCADE,
  jenis_maintenance TEXT NOT NULL CHECK (jenis_maintenance IN ('servis', 'ganti_oli', 'kalibrasi', 'inspeksi')),
  tanggal_terakhir DATE,
  tanggal_berikutnya DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'terjadwal' CHECK (status IN ('terjadwal', 'selesai', 'terlambat')),
  teknisi VARCHAR(255),
  catatan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bon_logistik (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  satuan_id UUID NOT NULL REFERENCES public.satuans(id) ON DELETE CASCADE,
  kompi_id UUID REFERENCES public.satuans(id) ON DELETE SET NULL,
  diminta_oleh UUID REFERENCES public.users(id) ON DELETE SET NULL,
  inventaris_id UUID REFERENCES public.inventaris_almatzi(id) ON DELETE SET NULL,
  nama_item VARCHAR(255) NOT NULL,
  jumlah_diminta INTEGER NOT NULL,
  keperluan TEXT NOT NULL,
  tanggal_dibutuhkan DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'diajukan' CHECK (status IN ('diajukan', 'disetujui', 'ditolak', 'diserahkan')),
  disetujui_oleh UUID REFERENCES public.users(id) ON DELETE SET NULL,
  catatan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- G. Upgrade existing tables for new access control and approval flow.
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS klasifikasi TEXT NOT NULL DEFAULT 'biasa' CHECK (klasifikasi IN ('biasa', 'terbatas', 'rahasia', 'sangat_rahasia')), 
  ADD COLUMN IF NOT EXISTS min_role_akses TEXT DEFAULT 'anggota',
  ADD COLUMN IF NOT EXISTS can_download BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS watermark_text TEXT;

ALTER TABLE public.leave_requests
  ADD COLUMN IF NOT EXISTS approved_by_danton UUID REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS approved_by_danki UUID REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS approved_by_pasi_pers UUID REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS approved_by_danyon UUID REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS status_chain TEXT NOT NULL DEFAULT 'draft' CHECK (status_chain IN ('draft', 'diajukan', 'disetujui_danton', 'disetujui_danki', 'disetujui_pasi_pers', 'disetujui_danyon', 'ditolak'));

-- H. Enable RLS and policies for the new tables.
ALTER TABLE public.kalatlap ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penugasan_lapangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan_kemajuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventaris_almatzi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jadwal_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bon_logistik ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "kalatlap_super_admin" ON public.kalatlap FOR ALL TO anon
  USING (public.current_karyo_is_role('super_admin'));

CREATE POLICY IF NOT EXISTS "kalatlap_read_satuan" ON public.kalatlap FOR SELECT TO anon
  USING (
    satuan_id = public.current_karyo_satuan_id()
    AND public.current_karyo_role_db() IN ('command_level','staff_ops','staff_pers','staff_log','unit_leader','field_officer','anggota')
  );

CREATE POLICY IF NOT EXISTS "kalatlap_write_staff_ops" ON public.kalatlap FOR INSERT TO anon
  WITH CHECK (
    satuan_id = public.current_karyo_satuan_id()
    AND public.current_karyo_is_role('staff_ops')
  );

CREATE POLICY IF NOT EXISTS "kalatlap_update_staff_ops" ON public.kalatlap FOR UPDATE TO anon
  USING (
    satuan_id = public.current_karyo_satuan_id()
    AND public.current_karyo_is_role('staff_ops')
  );

CREATE POLICY IF NOT EXISTS "penugasan_super_admin" ON public.penugasan_lapangan FOR ALL TO anon
  USING (public.current_karyo_is_role('super_admin'));

CREATE POLICY IF NOT EXISTS "penugasan_read_satuan" ON public.penugasan_lapangan FOR SELECT TO anon
  USING (
    satuan_id = public.current_karyo_satuan_id()
    AND public.current_karyo_role_db() IN ('command_level','staff_ops','staff_pers','staff_log','unit_leader','field_officer')
  );

CREATE POLICY IF NOT EXISTS "penugasan_write_unit_leader" ON public.penugasan_lapangan FOR INSERT TO anon
  WITH CHECK (
    satuan_id = public.current_karyo_satuan_id()
    AND kompi_id = public.current_karyo_kompi_id()
    AND public.current_karyo_is_role('unit_leader')
  );

CREATE POLICY IF NOT EXISTS "lapkem_super_admin" ON public.laporan_kemajuan FOR ALL TO anon
  USING (public.current_karyo_is_role('super_admin'));

CREATE POLICY IF NOT EXISTS "lapkem_read_satuan" ON public.laporan_kemajuan FOR SELECT TO anon
  USING (
    satuan_id = public.current_karyo_satuan_id()
    AND public.current_karyo_role_db() IN ('command_level','staff_ops','unit_leader','field_officer')
  );

CREATE POLICY IF NOT EXISTS "lapkem_write_field_officer" ON public.laporan_kemajuan FOR INSERT TO anon
  WITH CHECK (
    satuan_id = public.current_karyo_satuan_id()
    AND danton_id = public.current_karyo_user_id()
    AND public.current_karyo_is_role('field_officer')
  );

CREATE POLICY IF NOT EXISTS "inventaris_super_admin" ON public.inventaris_almatzi FOR ALL TO anon
  USING (public.current_karyo_is_role('super_admin'));

CREATE POLICY IF NOT EXISTS "inventaris_read_satuan" ON public.inventaris_almatzi FOR SELECT TO anon
  USING (
    satuan_id = public.current_karyo_satuan_id()
    AND public.current_karyo_role_db() IN ('command_level','staff_ops','staff_pers','staff_log','unit_leader','field_officer')
  );

CREATE POLICY IF NOT EXISTS "inventaris_write_staff_log" ON public.inventaris_almatzi FOR ALL TO anon
  USING (
    satuan_id = public.current_karyo_satuan_id()
    AND public.current_karyo_is_role('staff_log')
  );

CREATE POLICY IF NOT EXISTS "bon_super_admin" ON public.bon_logistik FOR ALL TO anon
  USING (public.current_karyo_is_role('super_admin'));

CREATE POLICY IF NOT EXISTS "bon_read" ON public.bon_logistik FOR SELECT TO anon
  USING (
    satuan_id = public.current_karyo_satuan_id()
    AND public.current_karyo_role_db() IN ('command_level','staff_log','unit_leader')
  );

CREATE POLICY IF NOT EXISTS "bon_insert_unit_leader" ON public.bon_logistik FOR INSERT TO anon
  WITH CHECK (
    satuan_id = public.current_karyo_satuan_id()
    AND diminta_oleh = public.current_karyo_user_id()
    AND public.current_karyo_is_role('unit_leader')
  );

CREATE POLICY IF NOT EXISTS "bon_approve_staff_log" ON public.bon_logistik FOR UPDATE TO anon
  USING (
    satuan_id = public.current_karyo_satuan_id()
    AND public.current_karyo_is_role('staff_log')
  );

CREATE INDEX IF NOT EXISTS idx_kalatlap_satuan_id ON public.kalatlap(satuan_id);
CREATE INDEX IF NOT EXISTS idx_penugasan_satuan_id ON public.penugasan_lapangan(satuan_id);
CREATE INDEX IF NOT EXISTS idx_penugasan_kompi_id ON public.penugasan_lapangan(kompi_id);
CREATE INDEX IF NOT EXISTS idx_lapkem_penugasan_id ON public.laporan_kemajuan(penugasan_id);
CREATE INDEX IF NOT EXISTS idx_lapkem_satuan_id ON public.laporan_kemajuan(satuan_id);
CREATE INDEX IF NOT EXISTS idx_inventaris_satuan_id ON public.inventaris_almatzi(satuan_id);
CREATE INDEX IF NOT EXISTS idx_jadmaint_inventaris_id ON public.jadwal_maintenance(inventaris_id);
CREATE INDEX IF NOT EXISTS idx_bon_satuan_id ON public.bon_logistik(satuan_id);

NOTIFY pgrst, 'reload schema';

COMMIT;
