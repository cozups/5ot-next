"use client";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export default function CartCount() {
  const count = useCartStore((state) => state.length);

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
