'use client';

import { Button } from './ui/button';
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
} from './ui/alert-dialog';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useInvalidateCache } from '@/hooks/useInvalidateCache';

export default function DeleteButton({
  action,
  queryKey,
}: {
  action: () => Promise<{
    success: boolean;
    errors?: Record<string, string[]>;
  }>;
  queryKey?: string[];
}) {
  const { invalidateCache } = useInvalidateCache(queryKey || []);
  const onClickDelete = async () => {
    const result = await action();

    if (result.success) {
      toast.success('성공적으로 삭제되었습니다.');
      invalidateCache();
    }
    if (result.errors) {
      Object.values(result.errors)
        .flat()
        .forEach((error) => {
          toast.error('삭제에 실패하였습니다.', { description: error });
        });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            관련 항목들이 전체 삭제됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onClickDelete}>삭제</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
