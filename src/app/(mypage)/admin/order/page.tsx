import OrderList from '@/components/order/order-list';

import { Order } from '@/types/orders';
import { createClient } from '@/utils/supabase/server';

export default async function OrderManagementPage() {
  const supabase = await createClient();
  const { data: orderList } = await supabase
    .from('orders')
    .select(`*, profiles:user_id (name)`)
    .order('created_at', { ascending: true })
    .overrideTypes<Order[]>();

  return (
    <div className="h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold">주문 관리</h1>
      <div>
        <OrderList role="admin" list={orderList} />
      </div>
    </div>
  );
}
