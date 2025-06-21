import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Order } from '@/types/orders';
import OrderStatusAction from './order-status-action';
import DeleteButton from './delete-button';
import { deleteOrder, updateOrderStatus } from '@/actions/orders';

export default function OrderList({
  list,
  role,
}: {
  list: Order[] | null;
  role: string;
}) {
  const isExist = list && list.length > 0;

  const status = {
    processing: '처리 중',
    done: '완료',
    delivering: '배송 중',
    canceled: '취소',
  };

  console.log(list);

  return (
    <>
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
        {isExist && (
          <TableBody>
            {list.map((order: Order) => (
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
                  {role === 'admin' && (
                    <OrderStatusAction
                      defaultValue={order.status}
                      action={updateOrderStatus.bind(null, order.id)}
                    />
                  )}
                  {role === 'normal' && (
                    <p>{status[order.status as keyof typeof status]}</p>
                  )}
                </TableCell>
                <TableCell>
                  <DeleteButton action={deleteOrder.bind(null, order.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {!isExist && (
        <p className="text-center font-semibold my-2">주문 내역이 없습니다.</p>
      )}
    </>
  );
}
