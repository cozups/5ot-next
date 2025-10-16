import { getOrderProcessRate } from "@/lib/utils";
import { Order } from "@/types/orders";
import { createClient } from "@/utils/supabase/server";

export default async function OrderStatistics() {
  const supabase = await createClient();

  const { data: orders } = await supabase.from("orders").select().overrideTypes<Order[]>();
  const orderProcessRate = getOrderProcessRate(orders);

  return (
    <div className="h-36 bg-gray-100 rounded-2xl px-6 py-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">총 주문</h2>
        <p className="font-semibold">처리율 {orderProcessRate.toFixed(2)}%</p>
      </div>
      <p className="text-4xl font-bold self-end">{orders?.length || 0}</p>
    </div>
  );
}
