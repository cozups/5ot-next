"use client";

import { getRecentReviews, getReviewsByPagination } from "@/actions/reviews";
import { Review } from "@/types/products";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReviewItem from "./review-Item";
import CustomPagination from "../ui/custom-pagination";
import { PaginationResponse } from "@/types/response";
import { cn, getTotalPage } from "@/lib/utils";
import ReviewItemSkeleton from "../skeleton/review-item-skeleton";
import { toast } from "sonner";

export default function ReviewList({
  initialData,
  page,
  productId,
  recent = false,
}: {
  initialData: PaginationResponse<Review[]> | null | undefined;
  page?: number;
  productId?: string;
  recent?: boolean;
}) {
  const {
    data: reviews,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reviews", recent ? "recent" : { page, productId }],
    queryFn: async () => {
      if (page && productId) {
        const { data, count } = await getReviewsByPagination(productId, {
          pageNum: page,
          itemsPerPage: 5,
        });
        return { data, count };
      }
      if (recent) {
        const { data } = await getRecentReviews(5);
        return { data };
      }
    },
    staleTime: 5 * 60 * 1000,
    initialData,
    placeholderData: keepPreviousData,
  });

  const totalPage = getTotalPage(reviews?.count || 0, 5);

  if (isError) {
    toast.error("리뷰를 불러오던 중 문제가 발생했습니다.", {
      description: error.message,
    });
  }

  return (
    <>
      <ul className={cn("flex flex-col gap-6 text-xs", !recent && "mt-8", "md:text-sm", "lg:text-base")}>
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => <ReviewItemSkeleton key={`review-${i}`} recent={recent} />)}
        {isSuccess &&
          reviews?.data?.map((review: Review) => (
            <ReviewItem key={review.id} review={review} panel={!recent} className={recent ? "bg-white" : ""} />
          ))}
      </ul>
      {!recent && !!reviews?.count && <CustomPagination currentPage={page!} totalPage={totalPage} />}
    </>
  );
}
