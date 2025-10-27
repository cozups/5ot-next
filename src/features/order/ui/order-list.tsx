"use client";

import dynamic from "next/dynamic";
import { User } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Order } from "@/types/orders";
import { cn, getTotalPage } from "@/lib/utils";
import OrderStatusAction from "./order-status-action";
import DeleteButton from "../../../components/delete-button";
import CustomPagination from "../../../components/ui/custom-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteOrder, updateOrderStatus } from "@/features/order/actions";
import { getOrdersByPagination, getOrdersByUserId } from "../queries";
import { ORDER_ITEMS_PER_PAGE } from "@/app/(mypage)/admin/order/constants";

const DELIVERY_STATE = {
  processing: "처리 중",
  done: "완료",
  delivering: "배송 중",
  canceled: "취소",
};

const UpdateDeliveryDialog = dynamic(() => import("./update-delivery-dialog"), { ssr: false });

export default function OrderList({ user }: { user: User | null }) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  const isAdmin = user?.user_metadata.role === "admin";

  const supabase = createClient();
  const { data, error } = useSuspenseQuery({
    queryKey: ["orders", isAdmin ? "admin" : "user", { page: currentPage }],
    queryFn: async () => {
      if (isAdmin) {
        const { data, count, errors } = await getOrdersByPagination(supabase, {
          pageNum: currentPage,
          itemsPerPage: ORDER_ITEMS_PER_PAGE,
        });

        if (errors) {
          throw new Error(errors.message);
        }

        return { data, count };
      }
      if (!isAdmin) {
        if (!user) {
          throw new Error("User not found");
        }

        const { data, count, errors } = await getOrdersByUserId(supabase, user?.id, {
          pageNum: currentPage,
          itemsPerPage: ORDER_ITEMS_PER_PAGE,
        });

        if (errors) {
          throw new Error(errors.message);
        }

        return { data, count };
      }
    },
    staleTime: 60 * 1000,
  });

  const list = data?.data || [];
  const totalPage = getTotalPage(data?.count || 0, ORDER_ITEMS_PER_PAGE);

  if (error) {
    throw error;
  }

  return (
    <>
      {list.length > 0 && (
        <div>
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
                      {isAdmin && (
                        <OrderStatusAction
                          defaultValue={order.status}
                          action={updateOrderStatus.bind(null, order.id)}
                        />
                      )}
                      {!isAdmin && <p>{DELIVERY_STATE[order.status as keyof typeof DELIVERY_STATE]}</p>}
                    </TableCell>
                    <TableCell>
                      <UpdateDeliveryDialog order={order} />
                      <DeleteButton
                        action={deleteOrder.bind(null, order.id)}
                        queryKey={["orders", isAdmin ? "admin" : "user"]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            }
          </Table>
          <CustomPagination currentPage={currentPage} totalPage={totalPage} />
        </div>
      )}
      {list.length === 0 && <p className="text-center font-semibold my-2">주문 내역이 없습니다.</p>}
    </>
  );
}
