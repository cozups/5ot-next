'use client';

import { useActionState, useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import OrderForm from './order-form';
import {
  getOrderById,
  OrderFormState,
  updateOrderData,
} from '@/actions/orders';
import { Order } from '@/types/orders';
import { toastError } from '@/lib/utils';

const initialState: OrderFormState = { success: false };

export default function UpdateDeliveryDialog({ order }: { order: Order }) {
  const [formState, formAction] = useActionState(
    updateOrderData.bind(null, order.id),
    initialState
  );
  const [defaultData, setDefaultData] = useState<Order | null>(null);

  useEffect(() => {
    const getOrderData = async () => {
      const result = await getOrderById(order.id);

      if (result.success) {
        setDefaultData(result.data?.[0]);
      }

      if (!result.success) {
        toast.error('주문 정보를 가져오는 중 문제가 발생하였습니다.', {
          description: result.errors?.getDataError[0],
        });
      }
    };

    getOrderData();
  }, [order]);

  useEffect(() => {
    if (formState.success) {
      toast.success('주문 정보가 수정되었습니다.');
    }

    if (formState.errors) {
      toastError('주문 정보 수정 중 문제가 발생하였습니다.', formState.errors);
    }
  }, [formState]);

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
        <OrderForm
          mode="update"
          action={formAction}
          defaultData={defaultData}
          formState={formState}
        />
      </DialogContent>
    </Dialog>
  );
}
