"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { createClient } from "@/utils/supabase/client";
import { Review } from "@/types/products";
import ReviewItem from "./review-Item";
import CustomPagination from "../ui/custom-pagination";
import { cn, getTotalPage } from "@/lib/utils";
import { useUser } from "@/hooks/use-users";

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
        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, count, error } = await supabase
          .from("reviews")
          .select(`*, products:product_id(*), profiles:user_id(*)`, {
            count: "exact",
          })
          .eq("product_id", productId)
          .range(from, to);

        if (error) {
          throw new Error(error.message);
        }

        return { data, count };
      }
      if (recent) {
        const { data, error } = await supabase
          .from("reviews")
          .select(`*, products:product_id(*), profiles:user_id(*)`)
          .limit(ITEMS_PER_PAGE)
          .order("created_at", { ascending: true })
          .overrideTypes<Review[]>();

        if (error) {
          throw new Error(error.message);
        }

        return { data };
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
