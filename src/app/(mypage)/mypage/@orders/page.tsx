import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import { getUser } from "@/features/auth/queries";
import OrderList from "@/features/order/ui/order-list";
import { getOrdersByUserId } from "@/features/order/actions";
import OrderListSkeleton from "@/components/skeleton/order-list-skeleton";

export default async function OrderListSection() {
  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  if (!user) {
    redirect("/login");
  }

  const { data: orderList, count, errors } = await getOrdersByUserId(user.id);

  if (errors) {
    throw errors;
  }

  return (
    <Suspense fallback={<OrderListSkeleton />}>
      <OrderList initialData={{ data: orderList || [], count: count || 0 }} />
    </Suspense>
  );
}
