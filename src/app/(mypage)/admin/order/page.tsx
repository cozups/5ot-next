import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Trash } from 'lucide-react';

export default async function OrderManagementPage() {
  const supabase = await createClient();
  const { data: orderList } = await supabase
    .from('orders')
    .select(`*, profiles:user_id (name)`);

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
                  <Select defaultValue={order.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="상태" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">처리 중</SelectItem>
                      <SelectItem value="delivering">배송 중</SelectItem>
                      <SelectItem value="done">완료</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="destructive">
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
