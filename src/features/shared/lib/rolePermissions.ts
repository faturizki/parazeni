/**
 * RBAC utilities untuk role hierarchy dan akses kontrol.
 *
 * Target baru: 7 role eksplisit.
 * Legacy values tetap didukung melalui normalisasi.
 */

import type { User } from '@/types';

export const APP_ROUTE_PATHS = {
  root: '/',
  login: '/login',
  register: '/register/:token',
  forceChangePin: '/force-change-pin',
  error: '/error',
} as const;

export const KNOWN_ROLES = [
  'super_admin',
  'command_level',
  'staff_ops',
  'staff_pers',
  'staff_log',
  'unit_leader',
  'field_officer',
  'anggota',
] as const;

export type KnownRole = typeof KNOWN_ROLES[number];
export type LegacyRole =
  | 'admin_satuan'
  | 'komandan'
  | 'staff_satuan'
  | 'prajurit'
  | 'admin'
  | 'staf'
  | 'guard';
export type RoleAlias = LegacyRole;

export const ROLE_CODE_MAP: Record<KnownRole, string> = {
  super_admin: 'SAD',
  command_level: 'CMD',
  staff_ops: 'S3',
  staff_pers: 'S1',
  staff_log: 'S4',
  unit_leader: 'DKI',
  field_officer: 'DTN',
  anggota: 'PJT',
};

export const ROLE_LABEL_MAP: Record<KnownRole, string> = {
  super_admin: 'Super Admin (Pasi Intel)',
  command_level: 'Command Level (Danyon/Wadan)',
  staff_ops: 'Staff Ops — S-3 (Pasi Ops)',
  staff_pers: 'Staff Pers — S-1 (Pasi Pers)',
  staff_log: 'Staff Log — S-4 (Pasi Log)',
  unit_leader: 'Unit Leader (Danki)',
  field_officer: 'Field Officer (Danton)',
  anggota: 'Anggota',
};

export const ROLE_ACCESS_MAP: Record<KnownRole, string> = {
  super_admin: 'Akses penuh lintas semua satuan, audit log, enkripsi',
  command_level: 'Read-only seluruh batalyon, otorisasi dokumen penting',
  staff_ops: 'Write kalatlap, penugasan lapangan, laporan operasi',
  staff_pers: 'Write data personel, kelola cuti, absensi satuan',
  staff_log: 'Write inventaris almatzi, maintenance, bon logistik',
  unit_leader: 'Kelola dan approve data kompi sendiri',
  field_officer: 'Isi laporan harian, absensi peleton sendiri',
  anggota: 'Read profil pribadi, ajukan cuti/izin, lihat jadwal',
};

const ROLE_ALIASES: Record<string, KnownRole> = {
  super_admin: 'super_admin',
  'super admin': 'super_admin',
  admin_satuan: 'super_admin',
  'admin satuan': 'super_admin',
  admin: 'super_admin',
  command_level: 'command_level',
  komandan: 'command_level',
  staff_ops: 'staff_ops',
  staff_pers: 'staff_pers',
  staff_log: 'staff_log',
  staff_satuan: 'staff_ops',
  staf: 'staff_ops',
  'staff operasional': 'staff_ops',
  'pasi ops': 'staff_ops',
  unit_leader: 'unit_leader',
  field_officer: 'field_officer',
  anggota: 'anggota',
  prajurit: 'anggota',
  guard: 'field_officer',
};

const ROLE_CODE_TO_ROLE: Record<string, KnownRole> = {
  SAD: 'super_admin',
  CMD: 'command_level',
  KMD: 'command_level',
  DAN: 'command_level',
  S3: 'staff_ops',
  S1: 'staff_pers',
  S4: 'staff_log',
  STF: 'staff_ops',
  DKI: 'unit_leader',
  DTN: 'field_officer',
  PJT: 'anggota',
  PRJ: 'anggota',
};

export const ROLE_ROUTE_PATHS = {
  super_admin: {
    dashboard: '/super-admin/dashboard',
    satuans: '/super-admin/satuans',
    settings: '/super-admin/settings',
    audit: '/super-admin/audit',
  },
  admin_satuan: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    branding: '/admin/branding',
    gatePassMonitor: '/admin/gatepass-monitor',
    logistics: '/admin/logistics',
    announcements: '/admin/announcements',
    attendance: '/admin/attendance',
    analytics: '/admin/analytics',
    apel: '/admin/apel',
    kegiatan: '/admin/kegiatan',
    schedule: '/admin/schedule',
    posJaga: '/admin/pos-jaga',
    documents: '/admin/documents',
    settings: '/admin/settings',
  },
  komandan: {
    dashboard: '/komandan/dashboard',
    tasks: '/komandan/tasks',
    personnel: '/komandan/personnel',
    gatePass: '/komandan/gatepass',
    attendance: '/komandan/attendance',
    laporanOps: '/komandan/laporan-ops',
    sprint: '/komandan/sprint',
    reports: '/komandan/reports',
    evaluation: '/komandan/evaluation',
    apel: '/komandan/apel',
    logistics: '/komandan/logistics',
  },
  staff_satuan: {
    dashboard: '/staff/dashboard',
    messages: '/staff/messages',
    leaveReview: '/staff/leave-review',
    laporanOps: '/staff/laporan-ops',
    sprint: '/staff/sprint',
  },
  prajurit: {
    dashboard: '/prajurit/dashboard',
    gatePass: '/prajurit/gatepass',
    attendance: '/prajurit/attendance',
    tasks: '/prajurit/tasks',
    leave: '/prajurit/leave',
    messages: '/prajurit/messages',
    profile: '/prajurit/profile',
    apel: '/prajurit/apel',
    kegiatan: '/prajurit/kegiatan',
    scanPos: '/prajurit/scan-pos',
  },
  command_level: {
    dashboard: '/command/dashboard',
    personnel: '/command/personnel',
    reports: '/command/reports',
    documents: '/command/documents',
  },
  staff_ops: {
    dashboard: '/staff-ops/dashboard',
    kalatlap: '/staff-ops/kalatlap',
    penugasan: '/staff-ops/penugasan',
    laporan: '/staff-ops/laporan',
  },
  staff_pers: {
    dashboard: '/staff-pers/dashboard',
    personnel: '/staff-pers/personnel',
    leave: '/staff-pers/leave',
    attendance: '/staff-pers/attendance',
  },
  staff_log: {
    dashboard: '/staff-log/dashboard',
    inventaris: '/staff-log/inventaris',
    maintenance: '/staff-log/maintenance',
    bon: '/staff-log/bon',
  },
  unit_leader: {
    dashboard: '/unit-leader/dashboard',
    tasks: '/unit-leader/tasks',
    personnel: '/unit-leader/personnel',
    leave: '/unit-leader/leave',
    gatepass: '/unit-leader/gatepass',
  },
  field_officer: {
    dashboard: '/field-officer/dashboard',
    absensi: '/field-officer/absensi',
    laporan: '/field-officer/laporan',
    tasks: '/field-officer/tasks',
  },
  anggota: {
    dashboard: '/anggota/dashboard',
    profile: '/anggota/profile',
    leave: '/anggota/leave',
    gatepass: '/anggota/gatepass',
    jadwal: '/anggota/jadwal',
  },
} as const;

export const ROUTE_ROLE_GROUPS = {
  superAdminOnly: ['super_admin'] as const,
  adminOnly: ['super_admin'] as const,
  komandanOnly: ['command_level'] as const,
  staffOnly: ['staff_ops'] as const,
  prajuritOnly: ['anggota'] as const,
  commandOnly: ['command_level'] as const,
  staffOpsOnly: ['staff_ops'] as const,
  staffPersOnly: ['staff_pers'] as const,
  staffLogOnly: ['staff_log'] as const,
  allStaff: ['staff_ops', 'staff_pers', 'staff_log'] as const,
  unitLeaderOnly: ['unit_leader'] as const,
  fieldOfficerOnly: ['field_officer'] as const,
  anggotaOnly: ['anggota'] as const,
  satuanScoped: ['command_level', 'staff_ops', 'staff_pers', 'staff_log', 'unit_leader', 'field_officer', 'anggota'] as const,
  allRoles: ['super_admin', 'command_level', 'staff_ops', 'staff_pers', 'staff_log', 'unit_leader', 'field_officer', 'anggota'] as const,
} as const;

const ROLE_DEFAULT_PATH_MAP: Record<KnownRole, string> = {
  super_admin: ROLE_ROUTE_PATHS.super_admin.dashboard,
  command_level: ROLE_ROUTE_PATHS.command_level.dashboard,
  staff_ops: ROLE_ROUTE_PATHS.staff_ops.dashboard,
  staff_pers: ROLE_ROUTE_PATHS.staff_pers.dashboard,
  staff_log: ROLE_ROUTE_PATHS.staff_log.dashboard,
  unit_leader: ROLE_ROUTE_PATHS.unit_leader.dashboard,
  field_officer: ROLE_ROUTE_PATHS.field_officer.dashboard,
  anggota: ROLE_ROUTE_PATHS.anggota.dashboard,
};

const ROLE_FALLBACK_PATH_MAP: Record<KnownRole, string[]> = {
  super_admin: [ROLE_ROUTE_PATHS.super_admin.dashboard],
  command_level: [ROLE_ROUTE_PATHS.command_level.dashboard, ROLE_ROUTE_PATHS.command_level.personnel],
  staff_ops: [ROLE_ROUTE_PATHS.staff_ops.dashboard, ROLE_ROUTE_PATHS.staff_ops.kalatlap],
  staff_pers: [ROLE_ROUTE_PATHS.staff_pers.dashboard, ROLE_ROUTE_PATHS.staff_pers.personnel],
  staff_log: [ROLE_ROUTE_PATHS.staff_log.dashboard, ROLE_ROUTE_PATHS.staff_log.inventaris],
  unit_leader: [ROLE_ROUTE_PATHS.unit_leader.dashboard, ROLE_ROUTE_PATHS.unit_leader.tasks],
  field_officer: [ROLE_ROUTE_PATHS.field_officer.dashboard, ROLE_ROUTE_PATHS.field_officer.absensi],
  anggota: [ROLE_ROUTE_PATHS.anggota.dashboard, ROLE_ROUTE_PATHS.anggota.profile],
};

function humanizeRole(role: string): string {
  return role
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function normalizeRole(role: string | null | undefined): KnownRole | null {
  if (!role) return null;
  const trimmed = role.trim();
  const lowered = trimmed.toLowerCase();
  if (KNOWN_ROLES.includes(lowered as KnownRole)) return lowered as KnownRole;
  const aliasMatch = ROLE_ALIASES[lowered];
  if (aliasMatch) return aliasMatch;
  const compacted = lowered.replace(/[^a-z0-9]+/g, ' ').trim();
  const compactAliasMatch = ROLE_ALIASES[compacted];
  if (compactAliasMatch) return compactAliasMatch;
  const codeMatch = ROLE_CODE_TO_ROLE[trimmed.toUpperCase().replace(/[^A-Z0-9]+/g, '')];
  if (codeMatch) return codeMatch;
  return null;
}

export function isKnownRole(role: string | null | undefined): role is KnownRole {
  return normalizeRole(role) !== null;
}

export function getRoleDisplayLabel(role: string | null | undefined): string {
  const normalized = normalizeRole(role);
  if (!normalized) return '—';
  return ROLE_LABEL_MAP[normalized];
}

export const ROLE_OPTIONS = KNOWN_ROLES.map((role) => ({
  value: role,
  label: `${getRoleDisplayLabel(role)} (${ROLE_CODE_MAP[role]})`,
  code: ROLE_CODE_MAP[role],
  description: ROLE_ACCESS_MAP[role],
}));

export function getRoleCode(role: string | null | undefined): string {
  const normalized = normalizeRole(role);
  return normalized ? ROLE_CODE_MAP[normalized] : '—';
}

export function getRoleAccessDescription(role: string | null | undefined): string {
  const normalized = normalizeRole(role);
  return normalized ? ROLE_ACCESS_MAP[normalized] : '—';
}

export function getRoleDefaultPath(role: string | null | undefined): string | null {
  const normalized = normalizeRole(role);
  return normalized ? ROLE_DEFAULT_PATH_MAP[normalized] : null;
}

export function getRoleFallbackPaths(role: string | null | undefined): string[] {
  const normalized = normalizeRole(role);
  return normalized ? ROLE_FALLBACK_PATH_MAP[normalized] : [];
}

export function getRoleProfilePath(role: string | null | undefined): string | null {
  const normalized = normalizeRole(role);
  if (!normalized) return null;
  if (normalized === 'super_admin') return ROLE_ROUTE_PATHS.super_admin.satuans;
  if (normalized === 'command_level') return ROLE_ROUTE_PATHS.command_level.personnel;
  if (normalized === 'staff_ops') return ROLE_ROUTE_PATHS.staff_ops.kalatlap;
  if (normalized === 'staff_pers') return ROLE_ROUTE_PATHS.staff_pers.personnel;
  if (normalized === 'staff_log') return ROLE_ROUTE_PATHS.staff_log.inventaris;
  if (normalized === 'unit_leader') return ROLE_ROUTE_PATHS.unit_leader.personnel;
  if (normalized === 'field_officer') return ROLE_ROUTE_PATHS.field_officer.absensi;
  if (normalized === 'anggota') return ROLE_ROUTE_PATHS.anggota.profile;
  return null;
}

export function getRoleMessagesPath(role: string | null | undefined): string | null {
  const normalized = normalizeRole(role);
  if (!normalized) return null;
  if (normalized === 'command_level') return ROLE_ROUTE_PATHS.command_level.documents;
  if (normalized === 'staff_ops') return ROLE_ROUTE_PATHS.staff_ops.kalatlap;
  if (normalized === 'staff_pers') return ROLE_ROUTE_PATHS.staff_pers.personnel;
  if (normalized === 'staff_log') return ROLE_ROUTE_PATHS.staff_log.inventaris;
  if (normalized === 'unit_leader') return ROLE_ROUTE_PATHS.unit_leader.tasks;
  if (normalized === 'field_officer') return ROLE_ROUTE_PATHS.field_officer.tasks;
  if (normalized === 'anggota') return ROLE_ROUTE_PATHS.anggota.profile;
  return getRoleDefaultPath(role);
}

export type GlobalSearchResultType = 'task' | 'user' | 'announcement';

export function getGlobalSearchResultPath(type: GlobalSearchResultType, role: string | null | undefined): string {
  if (type === 'task') {
    if (isAnggota(role)) return ROLE_ROUTE_PATHS.anggota.gatepass;
    if (isFieldOfficer(role)) return ROLE_ROUTE_PATHS.field_officer.tasks;
    if (isUnitLeader(role)) return ROLE_ROUTE_PATHS.unit_leader.tasks;
    if (isAnyStaff(role)) return ROLE_ROUTE_PATHS.staff_ops.dashboard;
    if (isCommandLevel(role)) return ROLE_ROUTE_PATHS.command_level.dashboard;
    if (isSuperAdmin(role)) return ROLE_ROUTE_PATHS.super_admin.dashboard;
    return APP_ROUTE_PATHS.error;
  }

  if (type === 'user') {
    if (isSuperAdmin(role)) return ROLE_ROUTE_PATHS.super_admin.satuans;
    if (isCommandLevel(role)) return ROLE_ROUTE_PATHS.command_level.personnel;
    if (isUnitLeader(role)) return ROLE_ROUTE_PATHS.unit_leader.personnel;
    if (isAnyStaff(role)) return ROLE_ROUTE_PATHS.staff_pers.personnel;
    if (isAnggota(role)) return ROLE_ROUTE_PATHS.anggota.profile;
    return APP_ROUTE_PATHS.error;
  }

  if (isSuperAdmin(role)) return ROLE_ROUTE_PATHS.super_admin.audit;
  if (isCommandLevel(role)) return ROLE_ROUTE_PATHS.command_level.documents;
  if (isAnyStaff(role)) return ROLE_ROUTE_PATHS.staff_ops.dashboard;
  if (isUnitLeader(role)) return ROLE_ROUTE_PATHS.unit_leader.dashboard;
  if (isFieldOfficer(role)) return ROLE_ROUTE_PATHS.field_officer.dashboard;
  if (isAnggota(role)) return ROLE_ROUTE_PATHS.anggota.profile;
  return getRoleDefaultPath(role) ?? APP_ROUTE_PATHS.error;
}

export function hasRole(role: string | null | undefined, expectedRole: KnownRole): boolean {
  return normalizeRole(role) === expectedRole;
}

export function isSuperAdmin(role: string | null | undefined): boolean {
  return hasRole(role, 'super_admin');
}

export function isCommandLevel(role: string | null | undefined): boolean {
  return hasRole(role, 'command_level');
}

export function isStaffOps(role: string | null | undefined): boolean {
  return hasRole(role, 'staff_ops');
}

export function isStaffPers(role: string | null | undefined): boolean {
  return hasRole(role, 'staff_pers');
}

export function isStaffLog(role: string | null | undefined): boolean {
  return hasRole(role, 'staff_log');
}

export function isAnyStaff(role: string | null | undefined): boolean {
  const normalized = normalizeRole(role);
  return normalized === 'staff_ops' || normalized === 'staff_pers' || normalized === 'staff_log';
}

export function isUnitLeader(role: string | null | undefined): boolean {
  return hasRole(role, 'unit_leader');
}

export function isFieldOfficer(role: string | null | undefined): boolean {
  return hasRole(role, 'field_officer');
}

export function isAnggota(role: string | null | undefined): boolean {
  return hasRole(role, 'anggota');
}

export function isRoleAdmin(role: string | null | undefined): boolean {
  return isSuperAdmin(role) || normalizeRole(role) === 'admin_satuan';
}

export function isRoleSuperAdmin(role: string | null | undefined): boolean {
  return isSuperAdmin(role);
}

export function isRoleKomandan(role: string | null | undefined): boolean {
  const normalized = normalizeRole(role);
  return (
    normalized === 'command_level' ||
    normalized === 'unit_leader' ||
    normalized === 'field_officer' ||
    normalized === 'komandan'
  );
}

export function isRoleStaff(role: string | null | undefined): boolean {
  const normalized = normalizeRole(role);
  return normalized === 'staff_satuan' || isAnyStaff(role);
}

export function isRolePrajurit(role: string | null | undefined): boolean {
  return isAnggota(role) || normalizeRole(role) === 'prajurit';
}

export type WriteModule =
  | 'attendance'
  | 'leave'
  | 'tasks'
  | 'logistics'
  | 'kalatlap'
  | 'penugasan'
  | 'laporan_kemajuan'
  | 'inventaris'
  | 'maintenance'
  | 'bon_logistik'
  | 'documents'
  | 'audit';

const WRITE_MODULE_ROLE_MAP: Record<WriteModule, KnownRole[]> = {
  attendance: ['staff_pers', 'field_officer'],
  leave: ['staff_pers', 'unit_leader', 'command_level'],
  tasks: ['staff_ops', 'unit_leader'],
  logistics: ['staff_log'],
  kalatlap: ['staff_ops'],
  penugasan: ['unit_leader'],
  laporan_kemajuan: ['field_officer'],
  inventaris: ['staff_log'],
  maintenance: ['staff_log'],
  bon_logistik: ['unit_leader', 'staff_log'],
  documents: ['super_admin', 'command_level', 'staff_ops', 'staff_pers', 'staff_log'],
  audit: ['super_admin'],
};

export function canWrite(user: User | null, module: WriteModule): boolean {
  if (!user) return false;
  if (isSuperAdmin(user.role)) return true;
  const role = normalizeRole(user.role);
  if (!role) return false;
  return WRITE_MODULE_ROLE_MAP[module]?.includes(role) ?? false;
}

export function isReadOnlyUser(user: User | null, module: WriteModule): boolean {
  return !canWrite(user, module);
}

export type KomandanScope = 'batalion' | 'kompi' | 'peleton' | 'none';

export type CommandLevel = 'BATALION' | 'KOMPI' | 'PELETON';

const LEVEL_TO_SCOPE: Record<CommandLevel, KomandanScope> = {
  BATALION: 'batalion',
  KOMPI: 'kompi',
  PELETON: 'peleton',
};

export function getKomandanScope(user: User | null): KomandanScope {
  if (!user || !isRoleKomandan(user.role)) return 'none';
  if (!user.level_komando) return 'none';
  return LEVEL_TO_SCOPE[user.level_komando] ?? 'none';
}

export function getKomandanScopeLabel(level?: CommandLevel | null): string {
  if (!level) return '—';
  const labels: Record<CommandLevel, string> = {
    BATALION: 'Komandan Batalion',
    KOMPI: 'Komandan Kompi',
    PELETON: 'Komandan Peleton',
  };
  return labels[level];
}

export function getKomandanScopeDescription(level?: CommandLevel | null): string {
  if (!level) return 'Akses data tidak terkonfigurasi.';
  const desc: Record<CommandLevel, string> = {
    BATALION: 'Akses penuh seluruh data satuan batalion.',
    KOMPI: 'Akses data kompi dan peleton di bawah kompinya.',
    PELETON: 'Akses terbatas pada data peleton sendiri.',
  };
  return desc[level];
}

export type StaffBidang = 's1' | 's3' | 's4' | 'umum';

export function getBidangFromJabatan(jabatan?: string): StaffBidang {
  if (!jabatan) return 'umum';
  const j = jabatan.toLowerCase();
  if (j.includes('s-1') || j.includes('s1') || j.includes('pers')) return 's1';
  if (j.includes('s-4') || j.includes('s4') || j.includes('log')) return 's4';
  if (j.includes('s-3') || j.includes('s3') || j.includes('ops')) return 's3';
  return 'umum';
}

export function getOperationalRoleLabel(user: User | null): string {
  if (!user) return '—';
  const role = normalizeRole(user.role);
  switch (role) {
    case 'super_admin':
    case 'command_level':
    case 'staff_ops':
    case 'staff_pers':
    case 'staff_log':
    case 'unit_leader':
    case 'field_officer':
    case 'anggota':
      return getRoleDisplayLabel(user.role);
    case 'komandan': {
      return getKomandanScopeLabel(user.level_komando);
    }
    case 'staff_satuan': {
      const bidang = getBidangFromJabatan(user.jabatan);
      const labels: Record<StaffBidang, string> = {
        s1: 'Staff Bidang S-1 Personel',
        s3: 'Staff Bidang S-3 Operasional',
        s4: 'Staff Bidang S-4 Logistik',
        umum: 'Staff Operasional',
      };
      return labels[bidang];
    }
    default:
      return getRoleDisplayLabel(user.role);
  }
}

export function canReadDisciplineNotes(user: User | null): boolean {
  if (!user) return false;
  return isRoleKomandan(user.role) || isSuperAdmin(user.role);
}
