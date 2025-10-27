"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { createClient } from "@/utils/supabase/client";
import { Review } from "@/types/review";
import ReviewItem from "./review-Item";
import { cn, getTotalPage } from "@/lib/utils";
import { useUser } from "@/hooks/use-users";
import CustomPagination from "@/components/ui/custom-pagination";
import { getRecentReviews, getReviewsByPagination } from "../queries";

const ITEMS_PER_PAGE = 5;

export default function ReviewList({
  page,
  productId,
  recent = false,
}: {
  page?: number;
  productId?: string;
  recent?: boolean;
}) {
  const supabase = createClient();
  const { user } = useUser();

  const { data: reviews } = useSuspenseQuery({
    queryKey: ["reviews", recent ? "recent" : { page, productId }],
    queryFn: async () => {
      if (page && productId) {
        const response = await getReviewsByPagination(supabase, productId, {
          pageNum: page,
          itemsPerPage: ITEMS_PER_PAGE,
        });

        if (response.errors) throw new Error(response.errors.message);

        return { data: response.data, count: response.count };
      }
      if (recent) {
        const response = await getRecentReviews(supabase, ITEMS_PER_PAGE);

        if (response.errors) throw new Error(response.errors.message);

        return { data: response.data, count: response.data?.length || 0 };
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const totalPage = getTotalPage(reviews?.count || 0, 5);

  return (
    <div className="mt-4 flex flex-col gap-2 overflow-auto">
      <ul className={cn("flex flex-col gap-6 text-xs", !recent && "mt-8", "md:text-sm", "lg:text-base")}>
        {reviews?.data?.map((review: Review) => (
          <ReviewItem
            key={review.id}
            review={review}
            controllable={!recent && (user?.user_metadata.role === "admin" || user?.id === review.user_id)}
            className={recent ? "bg-white" : ""}
            showProducts={recent}
          />
        ))}
      </ul>
      {!recent && !!reviews?.count && <CustomPagination currentPage={page!} totalPage={totalPage} />}
    </div>
  );
}
