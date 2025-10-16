import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/actions/auth";
import { getOrdersByUserId } from "@/actions/orders";
import OrderList from "@/components/order/order-list";
import OrderListSkeleton from "@/components/skeleton/order-list-skeleton";

export default async function OrderListSection() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orderList, count, errors } = await getOrdersByUserId(user.id);

  if (errors) {
    throw new Error(errors.getDataError?.[0] || "Unknown error");
  }

  return (
    <Suspense fallback={<OrderListSkeleton />}>
      <OrderList initialData={{ data: orderList, count }} />
    </Suspense>
  );
}
