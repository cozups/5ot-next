'use client';

import { createOrder, FormState } from '@/actions/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Purchase } from '@/types/orders';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import _ from 'lodash';
import { Cart } from '@/types/cart';

const initialState: FormState = { success: false };

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
    if (formState.success) {
      sessionStorage.removeItem('purchase');

      // cart 업데이트
      const cartStorage: Cart[] = JSON.parse(
        sessionStorage.getItem('cart') || '[]'
      );
      const updated = _.differenceWith(
        cartStorage,
        purchaseData,
        (cart, purchase) => cart.product.id === purchase.product.id
      );
      if (updated.length === 0) {
        sessionStorage.removeItem('cart');
      } else {
        sessionStorage.setItem('cart', JSON.stringify(updated));
      }

      setPurchaseData([]);
      router.push('/');
    }
  }, [formState.success, router]);

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
          <form
            action={formAction}
            className="h-full flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="receiver">받는 분</label>
                <Input
                  type="text"
                  name="receiver"
                  id="receiver"
                  className="bg-white"
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
                />
              </div>
            </div>
            <Button className="cursor-pointer self-end mt-4">주문하기</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
