"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { toastError } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from "@/types/orders";
import OrderStatusAction from "./order-status-action";
import DeleteButton from "../delete-button";
import { deleteOrder, getOrders, updateOrderStatus } from "@/actions/orders";
import UpdateDeliveryDialog from "./update-delivery-dialog";
import OrderItemSkeleton from "../skeleton/order-item-skeleton";

interface OrderListProps {
  initialData: Order[] | undefined;
  errors?: Record<string, string[]>;
  admin?: boolean;
}

export default function OrderList({ initialData, errors, admin = false }: OrderListProps) {
  const {
    data: list,
    error: fetchingError,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["orders", admin ? "admin" : "user"],
    queryFn: async () => {
      const { data } = await getOrders();

      return data;
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (errors) {
      toastError("주문 목록을 불러오던 중 문제가 발생하였습니다.", errors);
    }
  }, [errors]);

  if (isError) {
    toastError("주문 목록을 불러오던 중 문제가 발생하였습니다.", {
      fetchError: [fetchingError.message],
    });
  }

  const status = {
    processing: "처리 중",
    done: "완료",
    delivering: "배송 중",
    canceled: "취소",
  };

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
        {isLoading && <OrderItemSkeleton />}
        {isSuccess && (
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
                  {!admin && <p>{status[order.status as keyof typeof status]}</p>}
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
        )}
      </Table>
      {isSuccess && list?.length === 0 && <p className="text-center font-semibold my-2">주문 내역이 없습니다.</p>}
    </>
  );
}
