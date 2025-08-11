"use client";

import { Review } from "@/types/products";
import { Star } from "lucide-react";
import { deleteReview } from "@/actions/reviews";
import DeleteButton from "../delete-button";
import UpdateReviewDialog from "./update-review-dialog";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/auth";

export default function ReviewItem({
  review,
  panel = false,
  className,
  showProducts = false,
}: {
  review: Review;
  panel?: boolean;
  className?: string;
  showProducts?: boolean;
}) {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
  });

  const isAllowed = user?.user_metadata.role === "admin" || user?.id === review.user_id;

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
        {panel && isAllowed && (
          <div className="flex gap-1">
            {user?.id === review.user_id && <UpdateReviewDialog review={review} />}
            <DeleteButton action={deleteReview.bind(null, review.id)} queryKey={["reviews"]} />
          </div>
        )}
        {showProducts && <p className="text-xs">[{review.products.name}] 구매</p>}
      </div>
      <div className="mt-2">{review.content}</div>
    </li>
  );
}
