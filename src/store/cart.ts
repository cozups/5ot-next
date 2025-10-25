import { Cart } from "@/types/cart";
import { Purchase } from "@/types/orders";
import { Products } from "@/types/products";
import _ from "lodash";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartStore {
  data: Cart[];
  length: number;
  addItem: (product: Products, qty: string) => Cart | undefined;
  updateQty: (productId: string, qty: string) => void;
  updateCartAfterPurchase: (purchaseData: Purchase[]) => void;
  toggleSelected: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      data: [],
      length: 0,
      addItem: (product, qty) => {
        const { data } = get();
        const isExist = data.some((cart) => cart.product.id === product.id);

        if (isExist) {
          return;
        }

        const newItem = { product, qty, isSelected: true };
        const updated = [...data, newItem];
        set({ data: updated, length: updated.length });
        return newItem;
      },
      updateQty: (productId, qty) => {
        set((state) => ({ data: state.data.map((cart) => (cart.product.id === productId ? { ...cart, qty } : cart)) }));
      },
      updateCartAfterPurchase: (purchaseData) => {
        const { data } = get();

        const updated = _.differenceWith(
          data,
          purchaseData,
          (cart, purchase) => cart.product.id === purchase.product.id
        );

        set({ data: updated, length: updated.length });
        sessionStorage.removeItem("purchase");
      },
      toggleSelected: (productId) => {
        set((state) => ({
          data: state.data.map((cart) =>
            cart.product.id === productId ? { ...cart, isSelected: !cart.isSelected } : cart
          ),
        }));
      },
      removeItem: (productId) => {
        set((state) => {
          const updated = state.data.filter((cart) => cart.product.id !== productId);
          return { data: updated, length: updated.length };
        });
      },
      clearCart: () => set({ data: [], length: 0 }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
