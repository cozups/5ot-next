"use client";

import { Pencil } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Order } from "@/types/orders";
import OrderUpdateForm from "./order-update-form";
import { useState } from "react";

interface UpdateDeliveryDialogProps {
  order: Order;
}

export default function UpdateDeliveryDialog({ order }: UpdateDeliveryDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button className="mr-1" onClick={() => setIsOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>배송 정보 수정하기</DialogTitle>
          <DialogDescription>배송 정보를 수정합니다.</DialogDescription>
        </DialogHeader>
        <OrderUpdateForm defaultData={order} onComplete={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
