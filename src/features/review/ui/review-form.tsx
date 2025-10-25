"use client";

import { toast } from "sonner";
import { useActionState, useEffect } from "react";

import { Star } from "lucide-react";
import { Review } from "@/types/products";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { createReview, ReviewFormState } from "@/features/review/actions";
import {
  Button,
  DialogClose,
  DialogFooter,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@/components/ui";

interface ReviewFormProps {
  mode?: "write" | "update";
  action?: (payload: FormData) => void;
  data?: Review;
  productId?: string;
}

const initialState: ReviewFormState = { success: false };

export default function ReviewForm({ mode = "write", action, data, productId }: ReviewFormProps) {
  const [formState, formAction, isPending] = useActionState(
    createReview.bind(null, productId ? productId : ""),
    initialState
  );

  const { invalidateCache } = useInvalidateCache(["reviews"]);

  useEffect(() => {
    if (mode === "write") {
      if (formState.success) {
        toast.success("리뷰가 작성되었습니다.");
        invalidateCache();
      }

      if (formState.errors?.name === "server") {
        toast.error("리뷰 작성 중 문제가 발생했습니다.", {
          description: formState.errors.message,
        });
      }
    }
  }, [formState, mode, invalidateCache]);

  return (
    <form action={mode === "write" ? formAction : action} className="my-2 flex flex-col gap-4">
      <div className="flex items-center gap-2 mt-4">
        <Star fill="orange" className="w-4 h-4" />
        <Select name="star" defaultValue={data ? data.star.toString() : "5"}>
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
        defaultValue={mode === "update" ? data?.content : ""}
      ></Textarea>
      <div className="flex justify-between items-center">
        <p className="text-sm text-red-400">{formState.errors?.errors?.content[0]}</p>
        {mode === "update" && (
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
        {mode === "write" && (
          <Button type="submit" className="cursor-pointer self-end w-20" disabled={isPending}>
            {isPending ? <Spinner /> : "제출하기"}
          </Button>
        )}
      </div>
    </form>
  );
}
