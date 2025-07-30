"use client";

import { useActionState, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import OrderForm from "./order-form";
import { getOrderById, OrderFormState, updateOrderData } from "@/actions/orders";
import { Order } from "@/types/orders";
import { toastError } from "@/lib/utils";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";

const initialState: OrderFormState = { success: false };

interface UpdateDeliveryDialogProps {
  order: Order;
  admin?: boolean;
}

export default function UpdateDeliveryDialog({ order, admin = false }: UpdateDeliveryDialogProps) {
  const [formState, formAction] = useActionState(updateOrderData.bind(null, order.id), initialState);
  const [defaultData, setDefaultData] = useState<Order | null>(null);
  const { invalidateCache } = useInvalidateCache(["orders", admin ? "admin" : "user"]);

  const { data, isSuccess, isError, error } = useQuery({
    queryKey: ["order", order.id],
    queryFn: async () => {
      const { data } = await getOrderById(order.id);

      return data;
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      setDefaultData(data);
    }

    if (isError) {
      toastError("주문 정보를 불러오던 중 문제가 발생하였습니다.", {
        fetchError: [error.message],
      });
    }
  }, [data, isSuccess, isError, error]);

  useEffect(() => {
    if (formState.success) {
      toast.success("주문 정보가 수정되었습니다.");
      invalidateCache();
    }

    if (formState.errors) {
      toastError("주문 정보 수정 중 문제가 발생하였습니다.", formState.errors);
    }
  }, [formState, invalidateCache]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mr-1">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>배송 정보 수정하기</DialogTitle>
          <DialogDescription>배송 정보를 수정합니다.</DialogDescription>
        </DialogHeader>
        <OrderForm mode="update" action={formAction} defaultData={defaultData} formState={formState} />
      </DialogContent>
    </Dialog>
  );
}
