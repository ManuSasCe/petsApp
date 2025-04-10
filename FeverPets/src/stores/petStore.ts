import { create } from 'zustand';
import { Pet } from '../types';

interface PetOfDayState {
  pet: Pet | null;
  lastUpdated: string;
  actions: {
    setPetOfDay: (pet: Pet, date: string) => void;
  };
}

export const usePetOfDayStore = create<PetOfDayState>((set) => ({
  pet: null,
  lastUpdated: '',
  actions: {
    setPetOfDay: (pet, date) => set({ pet, lastUpdated: date }),
  },
}));

// Selectores optimizados
export const usePetOfDay = () => usePetOfDayStore((state) => state.pet);
export const usePetOfDayActions = () => usePetOfDayStore((state) => state.actions);
export const useLastUpdated = () => usePetOfDayStore((state) => state.lastUpdated);