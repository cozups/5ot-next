"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "@/features/auth";
import { useUser } from "@/hooks/use-users";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteUserDialog({ user }: { user: User }) {
  const router = useRouter();
  const { refetch } = useUser();

  const onClickDialog = async () => {
    const result = await deleteUser(user);

    if (result.success) {
      refetch();
      toast.success("회원 탈퇴되었습니다.", { description: "안녕히 가세요." });
      router.push("/");
    }

    if (result.errors?.name === "server") {
      toast.error("회원 탈퇴에 실패하였습니다.", {
        description: result.errors.message,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-gray-600 underline text-sm mt-4 cursor-pointer">회원 탈퇴하기</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말로 탈퇴하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>영구적으로 회원님의 정보가 삭제됩니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onClickDialog}>탈퇴하기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
