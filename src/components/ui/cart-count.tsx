"use client";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Cart } from "@/types/cart";
import { useEffect } from "react";

export default function CartCount() {
  const { length: count, setData: setCartData } = useCartStore();

  useEffect(() => {
    const cartStorage: Cart[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartData(cartStorage);
  }, [setCartData]);

  return (
    <div
      className={cn(
        "rounded-full bg-red-600 w-4 h-4 text-white text-[0.6rem] absolute -top-1 -right-1 z-1 text-center",
        count > 0 ? "block" : "hidden"
      )}
    >
      {count}
    </div>
  );
}
