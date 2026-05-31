import { lazy, Suspense } from 'react';
import { createHashRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import {
  APP_ROUTE_PATHS,
  ROLE_ROUTE_PATHS,
  ROUTE_ROLE_GROUPS,
} from '@/features/shared/lib/rolePermissions';
import LoadingSpinner from '@/features/shared/components/common/LoadingSpinner';

// ── Shared ─────────────────────────────────────────────────
const Landing        = lazy(() => import('@/features/shared/pages/Landing'));
const ErrorPage      = lazy(() => import('@/features/shared/pages/ErrorPage'));

// ── Auth ───────────────────────────────────────────────────
const Login          = lazy(() => import('@/features/auth/LoginPage'));
const RegisterByLink = lazy(() => import('@/features/auth/RegisterByLinkPage'));
const ForceChangePin = lazy(() => import('@/features/auth/ForceChangePinPage'));

// ── Super Admin ────────────────────────────────────────────
const SuperAdminDashboard = lazy(() => import('@/features/super-admin/pages/SuperAdminDashboard'));
const GlobalSatuanMgmt    = lazy(() => import('@/features/super-admin/pages/SatuanManagement'));
const GlobalSettings      = lazy(() => import('@/features/super-admin/pages/GlobalSettings'));
const GlobalAuditLog      = lazy(() => import('@/features/super-admin/pages/GlobalAuditLog'));

// ── Admin Satuan ───────────────────────────────────────────
const AdminDashboard   = lazy(() => import('@/features/admin/pages/AdminDashboard'));
const UserManagement   = lazy(() => import('@/features/admin/pages/UserManagement'));
const SatuanBranding   = lazy(() => import('@/features/admin/pages/SatuanBrandingPage'));
const GatePassMonitor  = lazy(() => import('@/features/admin/pages/GatePassMonitorPage'));
const Logistics        = lazy(() => import('@/features/admin/pages/Logistics'));
const Announcements    = lazy(() => import('@/features/admin/pages/Announcements'));
const AttendanceReport = lazy(() => import('@/features/admin/pages/AttendanceReport'));
const Analytics        = lazy(() => import('@/features/admin/pages/Analytics'));
const AdminApel        = lazy(() => import('@/features/admin/pages/Apel'));
const AdminKegiatan    = lazy(() => import('@/features/admin/pages/Kegiatan'));
const ShiftSchedule    = lazy(() => import('@/features/admin/pages/ShiftSchedule'));
const PosJaga          = lazy(() => import('@/features/admin/pages/PosJagaPage'));
const Documents        = lazy(() => import('@/features/admin/pages/Documents'));
const AdminSettings    = lazy(() => import('@/features/admin/pages/Settings'));

// ── Komandan ───────────────────────────────────────────────
const KomandanDashboard  = lazy(() => import('@/features/komandan/pages/KomandanDashboard'));
const TaskManagement     = lazy(() => import('@/features/komandan/pages/TaskManagement'));
const Personnel          = lazy(() => import('@/features/komandan/pages/Personnel'));
const GatePassApproval   = lazy(() => import('@/features/komandan/pages/GatePassApprovalPage'));
const KomandanAttendance = lazy(() => import('@/features/komandan/pages/KomandanAttendance'));
const LaporanOpsKomandan = lazy(() => import('@/features/komandan/pages/LaporanOps'));
const KomandanSprint     = lazy(() => import('@/features/komandan/pages/Sprint'));
const Reports            = lazy(() => import('@/features/komandan/pages/Reports'));
const Evaluation         = lazy(() => import('@/features/komandan/pages/Evaluation'));
const KomandanApel       = lazy(() => import('@/features/komandan/pages/Apel'));
const LogisticsRequest   = lazy(() => import('@/features/komandan/pages/LogisticsRequest'));

// ── Staff Satuan ───────────────────────────────────────────
const StaffDashboard   = lazy(() => import('@/features/staff/pages/StaffDashboard'));
const StaffMessages    = lazy(() => import('@/features/staff/pages/StaffMessages'));
const StaffLeaveReview = lazy(() => import('@/features/staff/pages/LeaveReview'));
const StaffLaporanOps  = lazy(() => import('@/features/staff/pages/LaporanOps'));
const StaffSprint      = lazy(() => import('@/features/staff/pages/Sprint'));

// ── Prajurit ───────────────────────────────────────────────
const PrajuritDashboard = lazy(() => import('@/features/prajurit/pages/PrajuritDashboard'));
const GatePassPage      = lazy(() => import('@/features/prajurit/pages/GatePassPage'));
const Attendance        = lazy(() => import('@/features/prajurit/pages/Attendance'));
const MyTasks           = lazy(() => import('@/features/prajurit/pages/MyTasks'));
const LeaveRequest      = lazy(() => import('@/features/prajurit/pages/LeaveRequest'));
const Messages          = lazy(() => import('@/features/prajurit/pages/Messages'));
const Profile           = lazy(() => import('@/features/prajurit/pages/Profile'));
const PrajuritApel      = lazy(() => import('@/features/prajurit/pages/Apel'));
const PrajuritKegiatan  = lazy(() => import('@/features/prajurit/pages/Kegiatan'));
const ScanPosJaga       = lazy(() => import('@/features/prajurit/pages/ScanPosJagaPage'));

// ── Command Level ────────────────────────────────────────────
const CommandDashboard   = lazy(() => import('@/features/command/pages/CommandDashboard'));
const CommandPersonnel   = lazy(() => import('@/features/command/pages/CommandPersonnel'));
const CommandReports     = lazy(() => import('@/features/command/pages/CommandReports'));
const CommandDocuments   = lazy(() => import('@/features/command/pages/CommandDocuments'));

// ── Staff Ops ──────────────────────────────────────────────
const StaffOpsDashboard  = lazy(() => import('@/features/staff-ops/pages/StaffOpsDashboard'));
const Kalatlap           = lazy(() => import('@/features/staff-ops/pages/Kalatlap'));
const PenugasanLapangan  = lazy(() => import('@/features/staff-ops/pages/PenugasanLapangan'));
const LaporanOpsStaff    = lazy(() => import('@/features/staff-ops/pages/LaporanOps'));

// ── Staff Pers ────────────────────────────────────────────
const StaffPersDashboard = lazy(() => import('@/features/staff-pers/pages/StaffPersDashboard'));
const StaffPersPersonnel = lazy(() => import('@/features/staff-pers/pages/Personnel'));
const StaffPersLeave     = lazy(() => import('@/features/staff-pers/pages/LeaveManagement'));
const StaffPersAttendance= lazy(() => import('@/features/staff-pers/pages/AttendanceManagement'));

// ── Staff Log ──────────────────────────────────────────────
const StaffLogDashboard  = lazy(() => import('@/features/staff-log/pages/StaffLogDashboard'));
const Inventaris         = lazy(() => import('@/features/staff-log/pages/Inventaris'));
const Maintenance        = lazy(() => import('@/features/staff-log/pages/Maintenance'));
const BonLogistik        = lazy(() => import('@/features/staff-log/pages/BonLogistik'));

// ── Unit Leader ─────────────────────────────────────────────
const UnitLeaderDashboard= lazy(() => import('@/features/unit-leader/pages/UnitLeaderDashboard'));
const UnitLeaderTasks    = lazy(() => import('@/features/unit-leader/pages/TaskManagement'));
const UnitLeaderPersonnel= lazy(() => import('@/features/unit-leader/pages/Personnel'));
const UnitLeaderLeave    = lazy(() => import('@/features/unit-leader/pages/LeaveApproval'));
const UnitLeaderGatepass = lazy(() => import('@/features/unit-leader/pages/GatePassApproval'));

// ── Field Officer ───────────────────────────────────────────
const FieldOfficerDashboard= lazy(() => import('@/features/field-officer/pages/FieldOfficerDashboard'));
const FieldOfficerAbsensi  = lazy(() => import('@/features/field-officer/pages/Absensi'));
const LaporanKemajuan      = lazy(() => import('@/features/field-officer/pages/LaporanKemajuan'));
const FieldOfficerTasks    = lazy(() => import('@/features/field-officer/pages/MyTasks'));

// ── Anggota ─────────────────────────────────────────────────
const AnggotaDashboard   = lazy(() => import('@/features/anggota/pages/AnggotaDashboard'));
const AnggotaProfile     = lazy(() => import('@/features/anggota/pages/Profile'));
const AnggotaLeave       = lazy(() => import('@/features/anggota/pages/LeaveRequest'));
const AnggotaGatepass    = lazy(() => import('@/features/anggota/pages/GatePassPage'));
const AnggotaJadwal      = lazy(() => import('@/features/anggota/pages/Jadwal'));

// ── Helper ─────────────────────────────────────────────────
const wrap = (el: React.ReactNode) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>{el}</Suspense>
);

const R = ROLE_ROUTE_PATHS;
const G = ROUTE_ROLE_GROUPS;

export const router = createHashRouter([
  // Public
  { path: APP_ROUTE_PATHS.root,     element: wrap(<Landing />) },
  { path: APP_ROUTE_PATHS.login,    element: wrap(<Login />) },
  { path: APP_ROUTE_PATHS.register, element: wrap(<RegisterByLink />) },
  { path: APP_ROUTE_PATHS.error,    element: wrap(<ErrorPage />) },

  // Force change PIN — semua role
  {
    element: <ProtectedRoute allowedRoles={G.allRoles} />,
    children: [
      { path: APP_ROUTE_PATHS.forceChangePin, element: wrap(<ForceChangePin />) },
    ],
  },

  // ── Super Admin ──────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.superAdminOnly} />,
    children: [
      { path: R.super_admin.dashboard, element: wrap(<SuperAdminDashboard />) },
      { path: R.super_admin.satuans,   element: wrap(<GlobalSatuanMgmt />) },
      { path: R.super_admin.settings,  element: wrap(<GlobalSettings />) },
      { path: R.super_admin.audit,     element: wrap(<GlobalAuditLog />) },
    ],
  },

  // ── Admin Satuan ─────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.adminOnly} />,
    children: [
      { path: R.admin_satuan.dashboard,       element: wrap(<AdminDashboard />) },
      { path: R.admin_satuan.users,           element: wrap(<UserManagement />) },
      { path: R.admin_satuan.branding,        element: wrap(<SatuanBranding />) },
      { path: R.admin_satuan.gatePassMonitor, element: wrap(<GatePassMonitor />) },
      { path: R.admin_satuan.logistics,       element: wrap(<Logistics />) },
      { path: R.admin_satuan.announcements,   element: wrap(<Announcements />) },
      { path: R.admin_satuan.attendance,      element: wrap(<AttendanceReport />) },
      { path: R.admin_satuan.analytics,       element: wrap(<Analytics />) },
      { path: R.admin_satuan.apel,            element: wrap(<AdminApel />) },
      { path: R.admin_satuan.kegiatan,        element: wrap(<AdminKegiatan />) },
      { path: R.admin_satuan.schedule,        element: wrap(<ShiftSchedule />) },
      { path: R.admin_satuan.posJaga,         element: wrap(<PosJaga />) },
      { path: R.admin_satuan.documents,       element: wrap(<Documents />) },
      { path: R.admin_satuan.settings,        element: wrap(<AdminSettings />) },
    ],
  },

  // ── Komandan ─────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.komandanOnly} />,
    children: [
      { path: R.komandan.dashboard,    element: wrap(<KomandanDashboard />) },
      { path: R.komandan.tasks,        element: wrap(<TaskManagement />) },
      { path: R.komandan.personnel,    element: wrap(<Personnel />) },
      { path: R.komandan.gatePass,     element: wrap(<GatePassApproval />) },
      { path: R.komandan.attendance,   element: wrap(<KomandanAttendance />) },
      { path: R.komandan.laporanOps,   element: wrap(<LaporanOpsKomandan />) },
      { path: R.komandan.sprint,       element: wrap(<KomandanSprint />) },
      { path: R.komandan.reports,      element: wrap(<Reports />) },
      { path: R.komandan.evaluation,   element: wrap(<Evaluation />) },
      { path: R.komandan.apel,         element: wrap(<KomandanApel />) },
      { path: R.komandan.logistics,    element: wrap(<LogisticsRequest />) },
    ],
  },

  // ── Staff Satuan ─────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.staffOnly} />,
    children: [
      { path: R.staff_satuan.dashboard,   element: wrap(<StaffDashboard />) },
      { path: R.staff_satuan.messages,    element: wrap(<StaffMessages />) },
      { path: R.staff_satuan.leaveReview, element: wrap(<StaffLeaveReview />) },
      { path: R.staff_satuan.laporanOps,  element: wrap(<StaffLaporanOps />) },
      { path: R.staff_satuan.sprint,      element: wrap(<StaffSprint />) },
    ],
  },

  // ── Prajurit ─────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.prajuritOnly} />,
    children: [
      { path: R.prajurit.dashboard,  element: wrap(<PrajuritDashboard />) },
      { path: R.prajurit.gatePass,   element: wrap(<GatePassPage />) },
      { path: R.prajurit.attendance, element: wrap(<Attendance />) },
      { path: R.prajurit.tasks,      element: wrap(<MyTasks />) },
      { path: R.prajurit.leave,      element: wrap(<LeaveRequest />) },
      { path: R.prajurit.messages,   element: wrap(<Messages />) },
      { path: R.prajurit.profile,    element: wrap(<Profile />) },
      { path: R.prajurit.apel,       element: wrap(<PrajuritApel />) },
      { path: R.prajurit.kegiatan,   element: wrap(<PrajuritKegiatan />) },
      { path: R.prajurit.scanPos,    element: wrap(<ScanPosJaga />) },
    ],
  },

  // ── Command Level ─────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.commandOnly} />,
    children: [
      { path: R.command_level.dashboard, element: wrap(<CommandDashboard />) },
      { path: R.command_level.personnel, element: wrap(<CommandPersonnel />) },
      { path: R.command_level.reports,   element: wrap(<CommandReports />) },
      { path: R.command_level.documents, element: wrap(<CommandDocuments />) },
    ],
  },

  // ── Staff Ops ─────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.staffOpsOnly} />,
    children: [
      { path: R.staff_ops.dashboard, element: wrap(<StaffOpsDashboard />) },
      { path: R.staff_ops.kalatlap, element: wrap(<Kalatlap />) },
      { path: R.staff_ops.penugasan, element: wrap(<PenugasanLapangan />) },
      { path: R.staff_ops.laporan, element: wrap(<LaporanOpsStaff />) },
    ],
  },

  // ── Staff Pers ───────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.staffPersOnly} />,
    children: [
      { path: R.staff_pers.dashboard, element: wrap(<StaffPersDashboard />) },
      { path: R.staff_pers.personnel, element: wrap(<StaffPersPersonnel />) },
      { path: R.staff_pers.leave, element: wrap(<StaffPersLeave />) },
      { path: R.staff_pers.attendance, element: wrap(<StaffPersAttendance />) },
    ],
  },

  // ── Staff Log ─────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.staffLogOnly} />,
    children: [
      { path: R.staff_log.dashboard, element: wrap(<StaffLogDashboard />) },
      { path: R.staff_log.inventaris, element: wrap(<Inventaris />) },
      { path: R.staff_log.maintenance, element: wrap(<Maintenance />) },
      { path: R.staff_log.bon, element: wrap(<BonLogistik />) },
    ],
  },

  // ── Unit Leader ───────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.unitLeaderOnly} />,
    children: [
      { path: R.unit_leader.dashboard, element: wrap(<UnitLeaderDashboard />) },
      { path: R.unit_leader.tasks, element: wrap(<UnitLeaderTasks />) },
      { path: R.unit_leader.personnel, element: wrap(<UnitLeaderPersonnel />) },
      { path: R.unit_leader.leave, element: wrap(<UnitLeaderLeave />) },
      { path: R.unit_leader.gatepass, element: wrap(<UnitLeaderGatepass />) },
    ],
  },

  // ── Field Officer ─────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.fieldOfficerOnly} />,
    children: [
      { path: R.field_officer.dashboard, element: wrap(<FieldOfficerDashboard />) },
      { path: R.field_officer.absensi, element: wrap(<FieldOfficerAbsensi />) },
      { path: R.field_officer.laporan, element: wrap(<LaporanKemajuan />) },
      { path: R.field_officer.tasks, element: wrap(<FieldOfficerTasks />) },
    ],
  },

  // ── Anggota ───────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={G.anggotaOnly} />,
    children: [
      { path: R.anggota.dashboard, element: wrap(<AnggotaDashboard />) },
      { path: R.anggota.profile, element: wrap(<AnggotaProfile />) },
      { path: R.anggota.leave, element: wrap(<AnggotaLeave />) },
      { path: R.anggota.gatepass, element: wrap(<AnggotaGatepass />) },
      { path: R.anggota.jadwal, element: wrap(<AnggotaJadwal />) },
    ],
  },

  // Catch-all
  { path: '*', element: wrap(<ErrorPage />) },
]);
