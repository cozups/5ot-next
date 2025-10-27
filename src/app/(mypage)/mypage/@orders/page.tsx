import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import { getUser } from "@/features/auth/queries";
import OrderList from "@/features/order/ui/order-list";
import { getOrdersByUserId } from "@/features/order/queries";
import OrderListSkeleton from "@/components/skeleton/order-list-skeleton";
import { QueryClient } from "@tanstack/react-query";

export default async function OrderListSection() {
  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  if (!user) {
    redirect("/login");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["orders", "admin", { page: 1 }],
    queryFn: async () => {
      const response = await getOrdersByUserId(supabase, user.id);

      if (response.errors) {
        throw new Error(response.errors.message);
      }

      return { data: response.data, count: response.count };
    },
    staleTime: 60 * 1000,
  });

  return (
    <Suspense fallback={<OrderListSkeleton />}>
      <OrderList user={user} />
    </Suspense>
  );
}
