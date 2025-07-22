'use client';

import { Pencil } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import ReviewForm from './review-form';
import { ReviewFormState, updateReview } from '@/actions/reviews';
import { Review } from '@/types/products';
import { useActionState, useEffect } from 'react';
import { toastError } from '@/lib/utils';
import { toast } from 'sonner';

interface UpdateButtonProps {
  review: Review;
}

const initialState: ReviewFormState = { success: false };

export default function UpdateReviewDialog({ review }: UpdateButtonProps) {
  const [formState, formAction] = useActionState(
    updateReview.bind(null, review.id),
    initialState
  );

  useEffect(() => {
    if (formState.success) {
      toast.success('리뷰가 수정되었습니다.');
    }

    if (formState.errors) {
      toastError('리뷰 수정 중 문제가 발생했습니다.', formState.errors);
    }
  }, [formState]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>리뷰 수정하기</DialogTitle>
        </DialogHeader>
        <ReviewForm mode="update" action={formAction} data={review} />
      </DialogContent>
    </Dialog>
  );
}
