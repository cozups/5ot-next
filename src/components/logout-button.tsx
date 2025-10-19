"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { logout } from "@/actions/auth";
import { Button } from "./ui";
import { DoorOpen } from "lucide-react";
import { useUser } from "@/hooks/use-users";

export default function LogoutButton() {
  const router = useRouter();
  const { refetch } = useUser();

  const onClickLogout = async () => {
    const result = await logout();

    if (result.success) {
      refetch();
      toast.success("로그아웃 되었습니다.");
      router.push("/");
    }

    if (result.errors?.logoutError) {
      toast.error("로그아웃에 실패했습니다.", {
        description: result.errors.logoutError[0],
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
