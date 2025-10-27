import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { getUser } from "@/features/auth/queries";
import { ORDER_ITEMS_PER_PAGE } from "./constants";
import OrderList from "@/features/order/ui/order-list";
import { getOrdersByPagination } from "@/features/order/queries";
import OrderListSkeleton from "@/components/skeleton/order-list-skeleton";

export default async function OrderManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string | string[] | undefined }>;
}) {
  const { page } = await searchParams;

  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  if (!user) {
    redirect("/login");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["orders", "admin", { page: 1 }],
    queryFn: async () => {
      const response = await getOrdersByPagination(supabase, {
        pageNum: Number(page) || 1,
        itemsPerPage: ORDER_ITEMS_PER_PAGE,
      });

      if (response.errors) {
        throw new Error(response.errors.message);
      }

      return { data: response.data, count: response.count };
    },
    staleTime: 60 * 1000,
  });

  return (
    <div className="h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold my-2">주문 관리</h1>
      <div>
        <Suspense fallback={<OrderListSkeleton />}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <OrderList user={user} />
          </HydrationBoundary>
        </Suspense>
      </div>
    </div>
  );
}
