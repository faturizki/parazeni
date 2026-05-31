import { useEffect } from 'react';
import DashboardLayout from '@/features/shared/components/layout/DashboardLayout';
import PageHeader from '@/features/shared/components/ui/PageHeader';
import StatCard, { StatsGrid } from '@/features/shared/components/ui/StatCard';
import { CardListSkeleton } from '@/features/shared/components/common/Skeleton';
import EmptyState from '@/features/shared/components/common/EmptyState';
import Button from '@/features/shared/components/common/Button';
import { useSatuans } from '@/features/shared/hooks/useSatuans';
import { useAuthStore } from '@/features/auth/authStore';
import { ROLE_ROUTE_PATHS } from '@/features/shared/lib/rolePermissions';
import { ICONS } from '@/icons';

export default function SuperAdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const { satuans, isLoading, fetchSatuans } = useSatuans();

  useEffect(() => {
    void fetchSatuans();
  }, [fetchSatuans]);

  const totalSatuan  = satuans.length;
  const activeSatuan = satuans.filter((s) => s.is_active).length;

  return (
    <DashboardLayout title="Dasbor Super Admin">
      <PageHeader
        title={`Selamat datang, ${user?.nama ?? 'Super Admin'}`}
        subtitle="Panel kontrol lintas satuan"
      />

      {isLoading ? (
        <CardListSkeleton />
      ) : (
        <>
          <StatsGrid>
            <StatCard
              label="Total Satuan"
              value={totalSatuan}
              icon={<ICONS.Shield size={24} aria-hidden="true" />}
              accent="blue"
            />
            <StatCard
              label="Satuan Aktif"
              value={activeSatuan}
              icon={<ICONS.CheckCircle2 size={24} aria-hidden="true" />}
              accent="green"
            />
            <StatCard
              label="Satuan Nonaktif"
              value={totalSatuan - activeSatuan}
              icon={<ICONS.XCircle size={24} aria-hidden="true" />}
              accent="red"
            />
          </StatsGrid>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              onClick={() => window.location.hash = ROLE_ROUTE_PATHS.super_admin.satuans}
            >
              Kelola Satuan
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.hash = ROLE_ROUTE_PATHS.super_admin.settings}
            >
              Settings Global
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.hash = ROLE_ROUTE_PATHS.super_admin.audit}
            >
              Audit Log
            </Button>
          </div>

          {satuans.length === 0 && (
            <EmptyState
              title="Belum ada satuan"
              description="Tambahkan satuan pertama untuk memulai."
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
