import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SortOption } from '../types';

interface FilterState {
  sortOption: SortOption;
  pagination: {
    page: number;
    pageSize: number;
  };
  setSortOption: (option: FilterState['sortOption']) => void;
  setPagination: (pagination: FilterState['pagination']) => void;
  resetFilters: () => void;

}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      sortOption: {
        key: 'name',
        direction: 'asc',
      },
      pagination: {
        page: 1,
        pageSize: 10,
      },
      resetFilters: () => set({
        sortOption: {
          key: 'name',
          direction: 'asc'
        },
        pagination: {
          page: 1,
          pageSize: 10
        }
      }),
      setSortOption: (sortOption) => set({ sortOption }),
      setPagination: (pagination) => set({ pagination }),
    }),
    {
      name: 'pet-filters-storage',
    }
  )
);