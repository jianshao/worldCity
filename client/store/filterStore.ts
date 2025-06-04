import { create } from 'zustand';

interface FilterState {
  gender: string;
  ageRange: [number, number];
  distance: number;
  city: string;
  setFilter: (filter: Partial<Omit<FilterState, 'setFilter'>>) => void;
  resetFilter: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  gender: '不限',
  ageRange: [18, 30],
  distance: 10,
  city: '上海',
  setFilter: (filter) => set((state) => ({ ...state, ...filter })),
  resetFilter: () =>
    set({
      gender: '不限',
      ageRange: [18, 30],
      distance: 10,
      city: '上海',
    }),
}));
