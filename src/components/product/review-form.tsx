'use client';

import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Review } from '@/types/products';
import { DialogClose, DialogFooter } from '../ui/dialog';
import { useActionState, useEffect } from 'react';
import { createReview, ReviewFormState } from '@/actions/reviews';
import { toastError } from '@/lib/utils';
import { toast } from 'sonner';

interface ReviewFormProps {
  mode?: 'write' | 'update';
  action?: (payload: FormData) => void;
  data?: Review;
  productId?: string;
}

const initialState: ReviewFormState = { success: false };

export default function ReviewForm({
  mode = 'write',
  action,
  data,
  productId,
}: ReviewFormProps) {
  const [formState, formAction] = useActionState(
    createReview.bind(null, productId ? productId : ''),
    initialState
  );

  useEffect(() => {
    if (mode === 'write') {
      if (formState.success) {
        toast.success('리뷰가 작성되었습니다.');
      }

      if (formState.errors) {
        toastError('리뷰 작성 중 문제가 발생했습니다.', formState.errors);
      }
    }
  }, [formState, mode]);

  return (
    <form
      action={mode === 'write' ? formAction : action}
      className="my-2 flex flex-col gap-4"
    >
      <div className="flex items-center gap-2 mt-4">
        <Star fill="orange" className="w-4 h-4" />
        <Select name="star" defaultValue={mode === 'update' ? data?.star : '5'}>
          <SelectTrigger>
            <SelectValue placeholder="평점" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5점</SelectItem>
            <SelectItem value="4">4점</SelectItem>
            <SelectItem value="3">3점</SelectItem>
            <SelectItem value="2">2점</SelectItem>
            <SelectItem value="1">1점</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea
        name="content"
        id="review"
        className="w-full border"
        placeholder="리뷰를 작성해 주세요."
        defaultValue={mode === 'update' ? data?.content : ''}
      ></Textarea>
      {mode === 'update' && (
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">취소</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" className="cursor-pointer self-end">
              제출하기
            </Button>
          </DialogClose>
        </DialogFooter>
      )}
      {mode === 'write' && (
        <Button type="submit" className="cursor-pointer self-end">
          제출하기
        </Button>
      )}
    </form>
  );
}
