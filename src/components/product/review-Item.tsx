"use client";

import { Review } from "@/types/products";
import { Star } from "lucide-react";
import { deleteReview } from "@/actions/reviews";
import DeleteButton from "../delete-button";
import UpdateReviewDialog from "./update-review-dialog";
import { cn } from "@/lib/utils";

export default function ReviewItem({
  review,
  controllable,
  className,
  showProducts = false,
}: {
  review: Review;
  controllable: boolean;
  className?: string;
  showProducts?: boolean;
}) {
  return (
    <li className={cn("bg-gray-100 rounded-xl p-4", className)}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <p className="font-semibold">{review.profiles?.name}</p>
          <div className="flex items-center gap-1">
            <Star fill="orange" className="w-4 h-4" />
            {review.star}
          </div>
        </div>
        {controllable && (
          <div className="flex gap-1">
            <UpdateReviewDialog review={review} />
            <DeleteButton action={deleteReview.bind(null, review.id)} queryKey={["reviews"]} />
          </div>
        )}
        {showProducts && <p className="text-xs">[{review.products.name}] 구매</p>}
      </div>
      <div className="mt-2">{review.content}</div>
    </li>
  );
}
