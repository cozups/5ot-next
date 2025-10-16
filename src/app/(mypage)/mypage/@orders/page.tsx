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

  const { data: orderList } = await getOrdersByUserId(user.id);

  return (
    <Suspense fallback={<OrderListSkeleton />}>
      <OrderList initialData={orderList} />
    </Suspense>
  );
}
