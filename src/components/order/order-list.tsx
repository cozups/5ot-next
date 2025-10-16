"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from "@/types/orders";
import OrderStatusAction from "./order-status-action";
import DeleteButton from "../delete-button";
import { deleteOrder, getOrders, getOrdersByUserId, updateOrderStatus } from "@/actions/orders";
import UpdateDeliveryDialog from "./update-delivery-dialog";
import { getUser } from "@/actions/auth";

interface OrderListProps {
  initialData: Order[] | undefined;
  admin?: boolean;
}

const DELIVERY_STATE = {
  processing: "처리 중",
  done: "완료",
  delivering: "배송 중",
  canceled: "취소",
};

export default function OrderList({ initialData, admin = false }: OrderListProps) {
  const { data: list, error } = useSuspenseQuery({
    queryKey: ["orders", admin ? "admin" : "user"],
    queryFn: async () => {
      if (admin) {
        const { data } = await getOrders();

        return data;
      }
      if (!admin) {
        const user = await getUser();

        if (!user) {
          throw new Error("User not found");
        }

        const { data } = await getOrdersByUserId(user?.id);

        return data;
      }
    },
    initialData,
    staleTime: 0,
  });

  if (error) {
    throw error;
  }

  return (
    <>
      <Table className={cn("text-xs", "lg:text-sm")}>
        <TableHeader>
          <TableRow>
            <TableHead>주문자</TableHead>
            <TableHead>상품</TableHead>
            <TableHead>배송 정보</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>관리</TableHead>
          </TableRow>
        </TableHeader>
        {
          <TableBody>
            {list?.map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell>{order.profiles?.name}</TableCell>
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
                      {order.receiver} ({order.phone})
                    </p>
                    <p>{order.address}</p>
                    <p className="text-gray-400 mt-2">{order.deliveryRequest}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {admin && (
                    <OrderStatusAction defaultValue={order.status} action={updateOrderStatus.bind(null, order.id)} />
                  )}
                  {!admin && <p>{DELIVERY_STATE[order.status as keyof typeof DELIVERY_STATE]}</p>}
                </TableCell>
                <TableCell>
                  <UpdateDeliveryDialog order={order} admin={admin} />
                  <DeleteButton
                    action={deleteOrder.bind(null, order.id)}
                    queryKey={["orders", admin ? "admin" : "user"]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        }
      </Table>
      {list?.length === 0 && <p className="text-center font-semibold my-2">주문 내역이 없습니다.</p>}
    </>
  );
}
