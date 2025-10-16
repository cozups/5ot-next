import { getOrders } from "@/actions/orders";
import OrderList from "@/components/order/order-list";
import OrderListSkeleton from "@/components/skeleton/order-list-skeleton";
import { Suspense } from "react";

export default async function OrderManagementPage() {
  const { data: orderList, errors } = await getOrders();

  if (errors) {
    throw new Error(errors.getDataError?.[0] || "Unknown error");
  }

  return (
    <div className="h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold my-2">주문 관리</h1>
      <div>
        <Suspense fallback={<OrderListSkeleton />}>
          <OrderList initialData={orderList} admin />
        </Suspense>
      </div>
    </div>
  );
}
