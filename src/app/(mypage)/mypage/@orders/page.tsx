import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getOrdersByUserId } from "@/features/order/actions";
import OrderList from "@/features/order/ui/order-list";
import OrderListSkeleton from "@/components/skeleton/order-list-skeleton";
import { getUser } from "@/features/auth";

export default async function OrderListSection() {
  const { data: user } = await getUser();

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
