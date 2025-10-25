import { getOrdersByPagination } from "@/features/order/actions";
import OrderList from "@/features/order/ui/order-list";
import OrderListSkeleton from "@/components/skeleton/order-list-skeleton";
import { Suspense } from "react";

export default async function OrderManagementPage() {
  const { data: orderList, errors, count } = await getOrdersByPagination();

  if (errors) {
    throw errors;
  }

  return (
    <div className="h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold my-2">주문 관리</h1>
      <div>
        <Suspense fallback={<OrderListSkeleton />}>
          <OrderList initialData={{ data: orderList || [], count: count || 0 }} />
        </Suspense>
      </div>
    </div>
  );
}
