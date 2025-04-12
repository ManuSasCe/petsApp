import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SortOption } from '../types';
interface FilterState {
  sortOption: SortOption;
  pagination: {
    page: number;
  };
}

interface FilterActions {
  setSortOption: (option: SortOption) => void;
  setPagination: (pagination: { page: number }) => void;
  resetFilters: () => void;
}

const useFilterStoreBase = create<FilterState & FilterActions>()(
  persist(
    (set) => ({
      sortOption: {
        key: 'name',
        direction: 'asc',
      },
      pagination: {
        page: 1
      },
      setSortOption: (sortOption) => set({ sortOption }),
      setPagination: (pagination) => set({ pagination }),
      resetFilters: () => set({
        sortOption: {
          key: 'name',
          direction: 'asc',
        },
        pagination: {
          page: 1
        },
      }),
    }),
    {
      name: 'pet-filters-storage',
    }
  )
);

export const useFilterStore = () => useFilterStoreBase((state) => ({
  sortOption: state.sortOption,
  pagination: state.pagination,
}));

export const useFilterActions = () => useFilterStoreBase((state) => ({
  setSortOption: state.setSortOption,
  setPagination: state.setPagination,
  resetFilters: state.resetFilters,
}));