'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { OrderFormState } from '@/actions/orders';
import { Order } from '@/types/orders';
import { DialogFooter, DialogClose } from '../ui/dialog';
import AddressSearch from './address-search';
import { useState } from 'react';

interface OrderFormProps {
  action: (payload: FormData) => void;
  mode: 'purchase' | 'update';
  defaultData?: Order | null;
  formState: OrderFormState;
}

export interface AddressResult {
  base: string;
  detail: string;
}

export default function OrderForm({
  action,
  mode,
  defaultData,
  formState,
}: OrderFormProps) {
  const [address, setAddress] = useState<AddressResult>({
    base: '',
    detail: '',
  });

  return (
    <form action={action} className="h-full flex flex-col justify-between">
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
          {formState.errors?.receiver?.map((error: string) => (
            <p className="text-sm text-red-400" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <label htmlFor="phone">전화번호</label>
          <Input
            type="text"
            id="phone"
            name="phone"
            className="bg-white"
            defaultValue={defaultData?.phone}
          />
          {formState.errors?.phone?.map((error: string) => (
            <p className="text-sm text-red-400" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <label>주소</label>
          <AddressSearch
            address={address}
            setAddress={setAddress}
            defaultData={defaultData?.address}
          />
          {formState.errors?.address?.map((error: string) => (
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
        <Button type="submit" className="cursor-pointer self-end mt-4">
          제출하기
        </Button>
      )}
    </form>
  );
}
