import { describe, expect, it } from 'vitest';
import {
  APP_ROUTE_PATHS,
  ROLE_ROUTE_PATHS,
  ROLE_OPTIONS,
  getGlobalSearchResultPath,
  getRoleAccessDescription,
  getRoleCode,
  getRoleDefaultPath,
  getRoleDisplayLabel,
  getRoleFallbackPaths,
  getRoleMessagesPath,
  getRoleProfilePath,
  isRoleAdmin,
  isRoleKomandan,
  isRolePrajurit,
  isRoleStaff,
  isRoleSuperAdmin,
  isKnownRole,
  normalizeRole,
} from '@/features/shared/lib/rolePermissions';

describe('rolePermissions helpers', () => {
  it('normalizes role codes and legacy values to canonical role', () => {
    expect(normalizeRole('SAD')).toBe('super_admin');
    expect(normalizeRole('KMD')).toBe('command_level');
    expect(normalizeRole('STF')).toBe('staff_ops');
    expect(normalizeRole('PRJ')).toBe('anggota');
    expect(normalizeRole('admin_satuan')).toBe('super_admin');
    expect(normalizeRole('komandan')).toBe('command_level');
    expect(normalizeRole('prajurit')).toBe('anggota');
  });

  it('keeps canonical roles as-is', () => {
    expect(normalizeRole('super_admin')).toBe('super_admin');
    expect(normalizeRole('command_level')).toBe('command_level');
    expect(normalizeRole('staff_ops')).toBe('staff_ops');
    expect(normalizeRole('staff_pers')).toBe('staff_pers');
    expect(normalizeRole('staff_log')).toBe('staff_log');
    expect(normalizeRole('unit_leader')).toBe('unit_leader');
    expect(normalizeRole('field_officer')).toBe('field_officer');
    expect(normalizeRole('anggota')).toBe('anggota');
  });

  it('normalizes common human-friendly role aliases', () => {
    expect(normalizeRole('Super Admin')).toBe('super_admin');
    expect(normalizeRole('Admin Satuan')).toBe('super_admin');
    expect(normalizeRole('Staff Operasional')).toBe('staff_ops');
  });

  it('recognizes known roles from canonical and code forms', () => {
    expect(isKnownRole('super_admin')).toBe(true);
    expect(isKnownRole('SAD')).toBe(true);
    expect(isKnownRole('anggota')).toBe(true);
    expect(isKnownRole('PJP')).toBe(false);
    expect(isKnownRole('unknown')).toBe(false);
  });

  it('returns correct display label and role code', () => {
    expect(getRoleDisplayLabel('super_admin')).toBe('Super Admin (Pasi Intel)');
    expect(getRoleDisplayLabel('SAD')).toBe('Super Admin (Pasi Intel)');
    expect(getRoleDisplayLabel('admin_satuan')).toBe('Super Admin (Pasi Intel)');
    expect(getRoleCode('komandan')).toBe('CMD');
    expect(getRoleCode('KMD')).toBe('CMD');
  });

  it('returns access description and default path for canonical and alias roles', () => {
    expect(getRoleAccessDescription('STF')).toBe('Write kalatlap, penugasan lapangan, laporan operasi');
    expect(getRoleDefaultPath('PRJ')).toBe('/anggota/dashboard');
    expect(getRoleDefaultPath('super_admin')).toBe('/super-admin/dashboard');
    expect(getRoleDefaultPath('admin_satuan')).toBe('/super-admin/dashboard');
    expect(getRoleDefaultPath('unknown')).toBeNull();
  });

  it('returns profile and message paths for canonical and legacy values', () => {
    expect(getRoleProfilePath('PRJ')).toBe('/anggota/profile');
    expect(getRoleProfilePath('admin_satuan')).toBe('/super-admin/satuans');
    expect(getRoleMessagesPath('KMD')).toBe('/command/documents');
    expect(getRoleMessagesPath('PJP')).toBeNull();
    expect(getRoleMessagesPath('unknown')).toBeNull();
  });

  it('keeps centralized route path catalog in sync with helper outputs', () => {
    expect(ROLE_ROUTE_PATHS.super_admin.dashboard).toBe('/super-admin/dashboard');
    expect(getRoleDefaultPath('admin_satuan')).toBe(ROLE_ROUTE_PATHS.super_admin.dashboard);
    expect(getRoleProfilePath('PRJ')).toBe(ROLE_ROUTE_PATHS.anggota.profile);
  });

  it('maps global search result type and role to centralized route paths', () => {
    expect(getGlobalSearchResultPath('task', 'PRJ')).toBe(ROLE_ROUTE_PATHS.anggota.gatepass);
    expect(getGlobalSearchResultPath('task', 'KMD')).toBe(ROLE_ROUTE_PATHS.command_level.dashboard);
    expect(getGlobalSearchResultPath('user', 'SAD')).toBe(ROLE_ROUTE_PATHS.super_admin.satuans);
    expect(getGlobalSearchResultPath('user', 'komandan')).toBe(ROLE_ROUTE_PATHS.command_level.personnel);
    expect(getGlobalSearchResultPath('announcement', 'admin_satuan')).toBe(ROLE_ROUTE_PATHS.super_admin.audit);
    expect(getGlobalSearchResultPath('announcement', 'PRJ')).toBe(ROLE_ROUTE_PATHS.anggota.profile);
    expect(getGlobalSearchResultPath('announcement', 'unknown')).toBe(APP_ROUTE_PATHS.error);
    expect(APP_ROUTE_PATHS.error).toBe('/error');
  });

  it('returns fallback paths and role options with code labels', () => {
    expect(getRoleFallbackPaths('SAD')).toContain('/super-admin/dashboard');
    const adminOption = ROLE_OPTIONS.find((opt) => opt.value === 'super_admin');
    expect(adminOption?.label).toBe('Super Admin (Pasi Intel) (SAD)');
    expect(adminOption?.description).toBe('Akses penuh lintas semua satuan, audit log, enkripsi');
  });

  it('supports semantic role predicates for code and canonical values', () => {
    expect(isRoleAdmin('admin_satuan')).toBe(true);
    expect(isRoleAdmin('SAD')).toBe(true);
    expect(isRoleSuperAdmin('SAD')).toBe(true);
    expect(isRoleKomandan('KMD')).toBe(true);
    expect(isRoleStaff('STF')).toBe(true);
    expect(isRolePrajurit('PRJ')).toBe(true);
    expect(isRoleSuperAdmin('staff_satuan')).toBe(false);
  });
});
