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
import { ReviewFormState } from '@/actions/reviews';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { Review } from '@/types/products';
import { DialogClose, DialogFooter } from '../ui/dialog';

interface ReviewFormProps {
  mode?: 'write' | 'update';
  action: (
    prevState: ReviewFormState,
    formData: FormData
  ) => Promise<ReviewFormState>;
  data?: Review;
}

const initialState: ReviewFormState = { success: false };

export default function ReviewForm({
  mode = 'write',
  action,
  data,
}: ReviewFormProps) {
  const [formState, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (formState.errors) {
      Object.entries(formState.errors).map(([, errors]) => {
        errors.map((e) => toast.error(e));
      });
    }
  }, [formState.errors]);

  return (
    <form action={formAction} className="my-2 flex flex-col gap-4">
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
