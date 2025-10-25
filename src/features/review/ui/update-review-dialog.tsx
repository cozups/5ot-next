"use client";

import { toast } from "sonner";
import { useActionState, useEffect } from "react";

import { Pencil } from "lucide-react";
import ReviewForm from "./review-form";
import { Review } from "@/types/products";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { ReviewFormState, updateReview } from "@/features/review/actions";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";

interface UpdateButtonProps {
  review: Review;
}

const initialState: ReviewFormState = { success: false };

export default function UpdateReviewDialog({ review }: UpdateButtonProps) {
  const [formState, formAction] = useActionState(updateReview.bind(null, review.id), initialState);

  const { invalidateCache } = useInvalidateCache(["reviews"]);

  useEffect(() => {
    if (formState.success) {
      toast.success("리뷰가 수정되었습니다.");
      invalidateCache();
    }

    if (formState.errors?.name === "server") {
      toast.error("리뷰 수정 중 문제가 발생했습니다.", {
        description: formState.errors.message,
      });
    }
  }, [formState, invalidateCache]);

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
