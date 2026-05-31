import { create } from 'zustand';

type StaffTab = 'laporan' | 'leave' | 'sprint';

interface StaffState {
  activeTab: StaffTab;
  setActiveTab: (tab: StaffTab) => void;
}

export const useStaffStore = create<StaffState>((set) => ({
  activeTab: 'laporan',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));