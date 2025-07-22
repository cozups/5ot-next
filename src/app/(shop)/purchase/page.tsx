'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import _ from 'lodash';
import { toast } from 'sonner';

import { createOrder, OrderFormState } from '@/actions/orders';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Purchase } from '@/types/orders';
import OrderForm from '@/components/order/order-form';
import { toastError } from '@/lib/utils';
import { Cart } from '@/types/cart';

const initialState: OrderFormState = { success: false };

export default function PurchasePage() {
  const [purchaseData, setPurchaseData] = useState<Purchase[]>([]);
  const [formState, formAction] = useActionState(
    createOrder.bind(null, purchaseData),
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    const purchaseStorage: Purchase[] = JSON.parse(
      sessionStorage.getItem('purchase') || '[]'
    );
    setPurchaseData(purchaseStorage);
  }, []);

  useEffect(() => {
    // 구매에 성공한 경우
    if (formState.success) {
      sessionStorage.removeItem('purchase');

      // cart 업데이트 (cart에 저장된 아이템들 중 구매 예정인 아이템 제거)
      const cartStorage: Cart[] = JSON.parse(
        sessionStorage.getItem('cart') || '[]'
      );
      const updated = _.differenceWith(
        cartStorage,
        purchaseData,
        (cart, purchase) => cart.product.id === purchase.product.id
      );

      if (updated.length === 0) {
        // cart 아이템 모두 구매한 경우
        sessionStorage.removeItem('cart');
      } else {
        // cart 아이템 중 일부만 구매한 경우
        sessionStorage.setItem('cart', JSON.stringify(updated));
      }

      toast.success('주문이 완료되었습니다.');
      setPurchaseData([]);
      router.push('/');
    }

    if (formState.errors) {
      toastError('주문 중 문제가 발생하였습니다.', formState.errors);
    }
  }, [formState, router]);

  const totalPrice = purchaseData.reduce(
    (acc, data) => acc + parseInt(data.product.price) * parseInt(data.qty),
    0
  );

  return (
    <div>
      <h1 className="text-3xl font-bold">구매하기</h1>
      <div className="grid grid-cols-2 gap-8">
        {/* 제품 */}
        <div className="flex flex-col gap-2">
          <div className="h-[calc(100vh-12rem)] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상품</TableHead>
                  <TableHead>가격</TableHead>
                  <TableHead>개수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseData.map((data) => (
                  <TableRow key={`${data.product.id}-${data.qty}`}>
                    <TableCell className="flex items-center gap-4">
                      <div className="w-16 aspect-square relative">
                        <Image
                          src={data.product.image}
                          fill
                          alt={data.product.name}
                          className="object-cover"
                        />
                      </div>
                      <p>{data.product.name}</p>
                    </TableCell>
                    <TableCell>
                      {data.product.price.toLocaleString()}원
                    </TableCell>
                    <TableCell>{data.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="h-1 bg-gray-300" />
          <p className="self-end font-semibold">
            총 {totalPrice.toLocaleString()}원
          </p>
        </div>
        {/* 구매 폼 */}
        <div className="bg-slate-100 rounded-2xl p-6">
          <OrderForm
            action={formAction}
            formState={formState}
            mode="purchase"
          />
        </div>
      </div>
    </div>
  );
}
