'use client';

import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { FormState } from '@/actions/orders';
import { Cart } from '@/types/cart';
import { Order, Purchase } from '@/types/orders';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { DialogFooter } from '../ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';

interface OrderFormProps {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  mode: 'purchase' | 'update';
  purchase?: {
    data: Purchase[];
    setData: Dispatch<SetStateAction<Purchase[]>>;
  };
  orderId?: string;
}

const initialState: FormState = { success: false };

export default function OrderForm({
  action,
  mode,
  purchase,
  orderId,
}: OrderFormProps) {
  const [formState, formAction] = useActionState(action, initialState);
  const router = useRouter();
  const [defaultData, setDefaultData] = useState<Order | null>(null);

  useEffect(() => {
    if (mode === 'update' && orderId) {
      const getOrderData = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from('orders')
          .select()
          .eq('id', orderId);

        setDefaultData(data?.[0]);
      };

      getOrderData();
    }
  }, [orderId, mode]);

  useEffect(() => {
    if (mode === 'purchase' && formState.success && purchase) {
      sessionStorage.removeItem('purchase');

      // cart 업데이트
      const cartStorage: Cart[] = JSON.parse(
        sessionStorage.getItem('cart') || '[]'
      );
      const updated = _.differenceWith(
        cartStorage,
        purchase?.data,
        (cart, purchase) => cart.product.id === purchase.product.id
      );
      if (updated.length === 0) {
        sessionStorage.removeItem('cart');
      } else {
        sessionStorage.setItem('cart', JSON.stringify(updated));
      }

      purchase.setData([]);
      router.push('/');
    }
  }, [formState.success, router, mode, purchase]);

  return (
    <form action={formAction} className="h-full flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="receiver">받는 분</label>
          <Input
            type="text"
            name="receiver"
            id="receiver"
            className="bg-white"
            defaultValue={defaultData?.receiver}
          />
          {formState.errors?.receiver?.map((error) => (
            <p className="text-sm text-red-400" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <label htmlFor="phoneNumber">전화번호</label>
          <Input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            className="bg-white"
            defaultValue={defaultData?.phoneNumber}
          />
          {formState.errors?.phoneNumber?.map((error) => (
            <p className="text-sm text-red-400" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <label htmlFor="address">주소</label>
          <Input
            type="text"
            id="address"
            name="address"
            className="bg-white"
            defaultValue={defaultData?.address}
          />
          {formState.errors?.address?.map((error) => (
            <p className="text-sm text-red-400" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <label htmlFor="deliveryRequest">배송 요청사항</label>
          <Textarea
            id="deliveryRequest"
            name="deliveryRequest"
            className="bg-white h-28 overflow-auto"
            defaultValue={defaultData?.deliveryRequest}
          />
        </div>
      </div>
      {mode === 'update' && (
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="cursor-pointer self-end mt-4"
            >
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" className="cursor-pointer self-end mt-4">
              수정하기
            </Button>
          </DialogClose>
        </DialogFooter>
      )}
      {mode === 'purchase' && (
        <Button className="cursor-pointer self-end mt-4">제출하기</Button>
      )}
    </form>
  );
}
