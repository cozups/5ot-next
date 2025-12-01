import { mapErrors } from "@/lib/handle-errors";
import { Cart } from "@/types/cart";
import { Purchase } from "@/types/orders";
import { Products } from "@/types/products";
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartStore {
  data: Cart[];
  length: number;
  getItem: () => Cart[];
  setItem: (data: Cart[]) => void;
  addItem: (product: Products, qty: string, userId?: string) => Promise<Cart | undefined>;
  updateQty: (productId: string, qty: string, userId?: string) => Promise<void>;
  updateCartAfterPurchase: (purchaseData: Purchase[], userId?: string) => Promise<void>;
  toggleCart: (checked: boolean, productId: string) => void;
  removeItem: (productId: string, userId?: string) => Promise<void>;
  clearCart: (userId?: string) => Promise<void>;
}

async function updateCartToDB(userId: string, data: Cart[]) {
  const supabase = createClient();
  const { error } = await supabase.from("profiles").update({ cart: data }).eq("id", userId);

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  return { success: true };
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
      addItem: async (product, qty, userId) => {
        const { data } = get();
        const isExist = data.some((cart) => cart.product.id === product.id);

        if (isExist) {
          return;
        }

        const newItem = { product, qty, isSelected: true, addedAt: new Date().toISOString() };
        const updated = [...data, newItem];
        set({ data: updated, length: updated.length });

        // 로그인 상태이면 DB에 저장
        if (userId) {
          const { success } = await updateCartToDB(userId, updated);
          if (!success) {
            // 실패 시 원래 상태로 복구
            set({ data, length: data.length });
            throw new Error("장바구니 추가에 실패했습니다. 다시 시도해주세요.");
          }
        }
        return newItem;
      },
      updateQty: async (productId, qty, userId) => {
        const { data } = get();
        const updated = data.map((cart) => (cart.product.id === productId ? { ...cart, qty } : cart));

        set({ data: updated, length: updated.length });

        // 로그인 상태이면 DB에 저장
        if (userId) {
          const { success } = await updateCartToDB(userId, updated);
          if (!success) {
            // 실패 시 원래 상태로 복구
            set({ data, length: data.length });
            throw new Error("장바구니 수량 업데이트에 실패했습니다. 다시 시도해주세요.");
          }
        }
      },
      // 구매 후 데이터 정리
      updateCartAfterPurchase: async (purchaseData, userId) => {
        const { data } = get();

        // 장바구니 데이터에서 구매한 데이터는 제거
        const purchaseProductsIds = new Set(purchaseData.map((purchaseItem) => purchaseItem.product.id));

        const updated = data.filter((cartItem) => !purchaseProductsIds.has(cartItem.product.id));

        set({ data: updated, length: updated.length });
        sessionStorage.removeItem("purchase");

        // 로그인 상태이면 DB에 저장
        if (userId) {
          const { success } = await updateCartToDB(userId, updated);
          if (!success) {
            // 실패 시 원래 상태로 복구
            set({ data, length: data.length });
            throw new Error("장바구니 데이터 정리에 실패했습니다. 다시 시도해주세요.");
          }
        }
      },
      toggleCart: (checked, productId) => {
        const { data } = get();
        const updated = data.map((cart) =>
          cart.product.id === productId
            ? {
                ...cart,
                isSelected: checked,
              }
            : cart
        );
        set({ data: updated, length: updated.length });
      },
      removeItem: async (productId, userId) => {
        const { data } = get();
        const updated = data.filter((cart) => cart.product.id !== productId);
        set({ data: updated, length: updated.length });

        // 로그인 상태이면 DB에 저장
        if (userId) {
          const { success } = await updateCartToDB(userId, updated);
          if (!success) {
            // 실패 시 원래 상태로 복구
            set({ data, length: data.length });
            throw new Error("장바구니 아이템 삭제에 실패했습니다. 다시 시도해주세요.");
          }
        }
      },

      clearCart: async (userId) => {
        const { data } = get();
        set({ data: [], length: 0 });

        // 로그인 상태이면 DB에 저장
        if (userId) {
          const { success } = await updateCartToDB(userId, []);
          if (!success) {
            // 실패 시 원래 상태로 복구
            set({ data, length: data.length });
            throw new Error("장바구니 데이터 정리에 실패했습니다. 다시 시도해주세요.");
          }
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
