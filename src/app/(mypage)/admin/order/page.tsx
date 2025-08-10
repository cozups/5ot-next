import { getOrders } from "@/actions/orders";
import OrderList from "@/components/order/order-list";

export default async function OrderManagementPage() {
  const { data: orderList, errors } = await getOrders();

  return (
    <div className="h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold my-2">주문 관리</h1>
      <div>
        <OrderList initialData={orderList} errors={errors} admin />
      </div>
    </div>
  );
}
