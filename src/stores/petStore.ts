import { create } from "zustand";
import { Pet } from "../types";
import { persist } from "zustand/middleware";

interface PetOfDayState {
  pet: Pet | null;
  lastUpdated: string;
}

interface PetOfDayActions {
  setPetOfDay: (pet: Pet, date: string) => void;
}

const usePetOfDayStoreBase = create<PetOfDayState & PetOfDayActions>()(
  persist(
    (set) => ({
      pet: null,
      lastUpdated: "",
      setPetOfDay: (pet, date) => set({ pet, lastUpdated: date }),
    }),
    {
      name: "pet-of-the-day-storage",
    },
  ),
);

export const usePetOfDay = () => usePetOfDayStoreBase((state) => state.pet);
export const useLastUpdated = () =>
  usePetOfDayStoreBase((state) => state.lastUpdated);
export const usePetOfDayActions = () =>
  usePetOfDayStoreBase((state) => ({
    setPetOfDay: state.setPetOfDay,
  }));
