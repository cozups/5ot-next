import { Cart } from '@/types/cart';
import { Purchase } from '@/types/orders';
import { create } from 'zustand';

export interface CartStore {
  data: Cart[];
  length: number;
  setData: (data: Cart[]) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  data: [],
  length: 0,
  setData: (data: Cart[]) => set({ data: data, length: data.length }),
}));
