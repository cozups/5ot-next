"use client";

import { useRouter } from "next/navigation";

import { DoorOpen } from "lucide-react";
import { Button } from "@/components/ui";
import { logout } from "@/features/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useFormTransition } from "@/hooks/use-form-transition";
import { useCartStore } from "@/store/cart";

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();

  const { execute } = useFormTransition(logout, {
    onSuccess: () => {
      localStorage.removeItem("cart-storage");
      clearCart();
      queryClient.setQueryData(["user"], null);
      router.push("/");
    },
    onSuccessText: ["로그아웃 되었습니다."],
  });

  const onClickLogout = () => {
    execute();
  };

  return (
    <Button className="cursor-pointer flex items-center" onClick={onClickLogout}>
      <DoorOpen className="w-4 h-4" />
      <span className="hidden md:inline">로그아웃</span>
    </Button>
  );
}
