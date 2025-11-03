"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

import { useUser } from "@/hooks/use-users";
import { deleteUser } from "@/features/auth";
import { useFormTransition } from "@/hooks/use-form-transition";
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

export default function DeleteUserDialog({ user }: { user: User }) {
  const router = useRouter();
  const { refetch } = useUser();
  const { execute } = useFormTransition(deleteUser, {
    onSuccess: () => {
      setIsOpen(false);
      refetch();
      router.push("/");
    },
    onSuccessText: ["회원 탈퇴되었습니다.", "안녕히 가세요."],
  });
  const [isOpen, setIsOpen] = useState(false);

  const onClickDialog = async () => {
    execute(user);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
