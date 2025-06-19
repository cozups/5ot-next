import { deleteOrder, updateOrderStatus } from '@/actions/orders';
import DeleteButton from '@/components/delete-button';
import OrderStatusAction from '@/components/order-status-action';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Order } from '@/types/orders';
import { createClient } from '@/utils/supabase/server';

export default async function OrderManagementPage() {
  const supabase = await createClient();
  const { data: orderList } = await supabase
    .from('orders')
    .select(`*, profiles:user_id (name)`)
    .order('created_at', { ascending: true });

  return (
    <div className="h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold">주문 관리</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>주문자</TableHead>
              <TableHead>상품</TableHead>
              <TableHead>배송 정보</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList?.map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell>{order.profiles!.name}</TableCell>
                <TableCell>
                  {order.products.map((item) => (
                    <p key={item.product.id}>
                      {item.product.name} X {item.qty}
                    </p>
                  ))}
                </TableCell>
                <TableCell>
                  <div>
                    <p>
                      {order.receiver} ({order.phoneNumber})
                    </p>
                    <p>{order.address}</p>
                    <p className="text-gray-400 mt-2">
                      {order.deliveryRequest}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <OrderStatusAction
                    defaultValue={order.status}
                    action={updateOrderStatus.bind(null, order.id)}
                  />
                </TableCell>
                <TableCell>
                  <DeleteButton action={deleteOrder.bind(null, order.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
