"use client";

import { Button } from "./ui/button";
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
} from "./ui/alert-dialog";
import { Trash } from "lucide-react";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { ErrorReturn } from "@/types/error";
import { useFormTransition } from "@/hooks/use-form-transition";
import { useState } from "react";
import { Spinner } from "./ui";

export default function DeleteButton({
  action,
  queryKey,
}: {
  action: () => Promise<{
    success: boolean;
    errors?: ErrorReturn | undefined;
  }>;
  queryKey?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { invalidateCache } = useInvalidateCache(queryKey || []);
  const { isPending, execute } = useFormTransition(action, {
    onSuccess: () => {
      invalidateCache();
      setIsOpen(false);
    },
    onSuccessText: ["성공적으로 삭제되었습니다."],
  });

  const onClickDelete = async () => {
    execute();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>관련 항목들이 전체 삭제됩니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onClickDelete} className="w-16" disabled={isPending}>
            {isPending ? <Spinner /> : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
