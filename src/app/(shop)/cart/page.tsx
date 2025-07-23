'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Cart } from '@/types/cart';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [cartData, setCartData] = useState<Cart[]>([]);
  const router = useRouter();

  useEffect(() => {
    const cartStorage: Cart[] = JSON.parse(
      localStorage.getItem('cart') || '[]'
    );
    setCartData(cartStorage);
  }, []);

  const toggleCart = (id: string) => {
    const updated = cartData.map((cart) =>
      cart.product.id === id ? { ...cart, isSelected: !cart.isSelected } : cart
    );
    localStorage.setItem('cart', JSON.stringify(updated));
    setCartData(updated);
  };

  const onChangeQty = (
    cart: Cart,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQty = event.target.value;
    const index = cartData.findIndex(
      (data) => data.product.id === cart.product.id
    );

    if (index > -1) {
      const updated = [...cartData];
      updated[index] = { ...updated[index], qty: newQty };
      localStorage.setItem('cart', JSON.stringify(updated));
      setCartData(updated);
    }
  };

  const onDeleteCart = (id: string) => {
    const updated = cartData.filter((data) => data.product.id !== id);
    setCartData(updated);

    if (!updated.length) {
      localStorage.removeItem('cart');
      return;
    }
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const onClickPurchase = () => {
    const selected = cartData.filter((cart) => cart.isSelected);
    const data = selected.map((item) => ({
      product: item.product,
      qty: item.qty,
    }));
    sessionStorage.setItem('purchase', JSON.stringify(data));
    router.push('/purchase');
  };
  const selected = cartData.filter((cart) => cart.isSelected);
  const totalPrice = selected.reduce(
    (acc, data) => acc + parseInt(data.product.price) * parseInt(data.qty),
    0
  );

  return (
    <div>
      <h1 className="text-3xl font-bold">장바구니</h1>
      <div className="min-h-96 max-h-[36rem] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>상품</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>개수</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartData.map((cart) => (
              <TableRow key={`${cart.product.id}-${cart.qty}`}>
                <TableCell>
                  <Checkbox
                    defaultChecked={cart.isSelected}
                    onCheckedChange={toggleCart.bind(null, cart.product.id)}
                  />
                </TableCell>
                <TableCell className="flex items-center gap-4">
                  <div className="w-16 aspect-square relative">
                    <Image
                      src={cart.product.image}
                      fill
                      alt={cart.product.name}
                      className="object-cover"
                    />
                  </div>
                  <p>{cart.product.name}</p>
                </TableCell>
                <TableCell>{cart.product.price.toLocaleString()}원</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    defaultValue={cart.qty}
                    className="w-24"
                    onChange={onChangeQty.bind(null, cart)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <Button
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={onDeleteCart.bind(null, cart.product.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="h-1 bg-gray-300" />
      {/* 합계 */}
      <div className="bg-slate-100 p-4 mt-4 rounded-xl">
        <h2 className="text-lg font-semibold">합계</h2>
        <div className="flex flex-col">
          <div className="w-96 h-32 overflow-auto">
            {selected.length === 0 && (
              <p className="text-sm">선택된 상품이 없습니다.</p>
            )}
            {selected.length > 0 &&
              selected.map((data) => (
                <div
                  key={data.product.id}
                  className="text-sm flex justify-between items-center"
                >
                  <p>
                    {data.product.name} X {data.qty}
                  </p>
                  <p>
                    {(
                      parseInt(data.product.price) * parseInt(data.qty)
                    ).toLocaleString()}
                    원
                  </p>
                </div>
              ))}
          </div>
          <div className="self-end flex flex-col items-end gap-2">
            <p className="font-semibold">총 {totalPrice.toLocaleString()}원</p>
            <Link href="/purchase">
              <Button className="cursor-pointer" onClick={onClickPurchase}>
                선택 상품 구매하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
