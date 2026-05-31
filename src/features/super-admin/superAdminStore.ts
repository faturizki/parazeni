import { create } from 'zustand';

interface SuperAdminState {
  selectedSatuanId: string | null;
  setSelectedSatuanId: (id: string | null) => void;
}

export const useSuperAdminStore = create<SuperAdminState>((set) => ({
  selectedSatuanId: null,
  setSelectedSatuanId: (id) => set({ selectedSatuanId: id }),
}));