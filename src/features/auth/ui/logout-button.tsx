"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { DoorOpen } from "lucide-react";
import { Button } from "@/components/ui";
import { logout } from "@/features/auth";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onClickLogout = async () => {
    const result = await logout();

    if (result.success) {
      queryClient.setQueryData(["user"], null);
      router.push("/");
      toast.success("로그아웃 되었습니다.");
    }

    if (result.errors?.name === "server") {
      toast.error("로그아웃에 실패했습니다.", {
        description: result.errors.message,
      });
    }
  };

  return (
    <Button className="cursor-pointer flex items-center" onClick={onClickLogout}>
      <DoorOpen className="w-4 h-4" />
      <span className="hidden md:inline">로그아웃</span>
    </Button>
  );
}
