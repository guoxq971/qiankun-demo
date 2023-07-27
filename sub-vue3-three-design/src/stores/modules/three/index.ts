import { defineStore } from 'pinia';

interface ThreeState {
  count: number;
}

export const useThreeStore = defineStore({
  id: 'app-three',
  state: (): ThreeState => ({
    count: 1,
  }),
  getters: {
    getCount(): number {
      return this.count;
    },
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
