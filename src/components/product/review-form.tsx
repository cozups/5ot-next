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
import { ReviewFormState } from '@/actions/products';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

const initialState: ReviewFormState = { success: false };

export default function ReviewForm({
  action,
}: {
  action: (
    prevState: ReviewFormState,
    formData: FormData
  ) => Promise<ReviewFormState>;
}) {
  const [formState, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (formState.errors) {
      toast.error('에러 발생!', {
        description: formState.errors.content[0],
      });
    }
  }, [formState.errors]);

  return (
    <form action={formAction} className="my-2 flex flex-col gap-4">
      <div className="flex items-center gap-2 mt-4">
        <Star fill="orange" className="w-4 h-4" />
        <Select name="star">
          <SelectTrigger>
            <SelectValue placeholder="평점" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="1">1</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea
        name="content"
        id="review"
        className="w-full border"
        placeholder="리뷰를 작성해 주세요."
      ></Textarea>
      <Button type="submit" className="cursor-pointer self-end">
        제출하기
      </Button>
    </form>
  );
}
