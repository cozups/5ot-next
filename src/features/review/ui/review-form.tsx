"use client";

import { toast } from "sonner";
import { useTransition } from "react";

import { Star } from "lucide-react";
import { Review } from "@/types/review";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { createReview, updateReview } from "@/features/review/actions";
import {
  Button,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@/components/ui";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ReviewFormData, reviewFormSchema } from "@/lib/validations-schema/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateFormData } from "@/lib/generate-form-data";
import { useUser } from "@/hooks/use-users";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  productId?: string;
  mode?: "write" | "update";
  defaultData?: Review;
  onComplete?: () => void;
}

export default function ReviewForm({ mode = "write", defaultData, productId, onComplete }: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { star: defaultData?.star.toString() || "5", content: defaultData?.content || "" },
  });
  const { user } = useUser();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const { invalidateCache } = useInvalidateCache(["reviews"]);

  const onSubmit: SubmitHandler<ReviewFormData> = (data) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const formData = generateFormData(data);

    startTransition(async () => {
      if (mode === "write" && productId) {
        const result = await createReview(productId, formData);

        if (result.success) {
          toast.success("리뷰가 작성되었습니다.");
          invalidateCache();
          reset();
        }

        if (result.errors) {
          toast.error("리뷰 작성 중 문제가 발생했습니다.", {
            description: result.errors.message,
          });
        }
      }
      if (mode === "update" && defaultData) {
        const result = await updateReview(defaultData.id, formData);

        if (result.success) {
          toast.success("리뷰가 작성되었습니다.");
          invalidateCache();
          onComplete?.();
        }

        if (result.errors) {
          toast.error("리뷰 작성 중 문제가 발생했습니다.", {
            description: result.errors.message,
          });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-2 flex flex-col gap-4">
      <div className="flex items-center gap-2 mt-4">
        <Star fill="orange" className="w-4 h-4" />
        <Controller
          name="star"
          control={control}
          render={({ field }) => (
            <Select {...field} onValueChange={field.onChange}>
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
          )}
        />
      </div>
      <Textarea
        {...register("content")}
        name="content"
        id="review"
        className="w-full border"
        placeholder="리뷰를 작성해 주세요."
      ></Textarea>
      <div className="flex justify-between items-center">
        <Button type="submit" className="cursor-pointer self-end w-20" disabled={isPending}>
          {isPending ? <Spinner /> : "제출하기"}
        </Button>
        {errors.content && <p className="text-sm text-red-400">{errors?.content.message}</p>}
      </div>
    </form>
  );
}
