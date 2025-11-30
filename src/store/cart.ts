import { Cart } from "@/types/cart";
import { Purchase } from "@/types/orders";
import { Products } from "@/types/products";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartStore {
  data: Cart[];
  length: number;
  getItem: () => Cart[];
  setItem: (data: Cart[]) => void;
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
      getItem: () => {
        const data = get().data;
        return data;
      },
      setItem: (data) => set({ data, length: data.length }),
      addItem: (product, qty) => {
        const { data } = get();
        const isExist = data.some((cart) => cart.product.id === product.id);

        if (isExist) {
          return;
        }

        const newItem = { product, qty, isSelected: true, addedAt: new Date().toISOString() };
        const updated = [...data, newItem];
        set({ data: updated, length: updated.length });
        return newItem;
      },
      updateQty: (productId, qty) => {
        set((state) => ({ data: state.data.map((cart) => (cart.product.id === productId ? { ...cart, qty } : cart)) }));
      },
      // 구매 후 데이터 정리
      updateCartAfterPurchase: (purchaseData) => {
        const { data } = get();

        // 장바구니 데이터에서 구매한 데이터는 제거
        const purchaseProductsIds = new Set(purchaseData.map((purchaseItem) => purchaseItem.product.id));

        const updated = data.filter((cartItem) => !purchaseProductsIds.has(cartItem.product.id));

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
