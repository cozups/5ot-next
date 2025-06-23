'use client';

import { Clothes } from '@/types/clothes';
import { useRef } from 'react';
import { Button } from '../ui/button';
import { ShoppingBasket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Cart } from '@/types/cart';
import Link from 'next/link';

export default function ProductActionPanel({ product }: { product: Clothes }) {
  const countRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onAddCart = (id: string) => {
    const cartStorage: Cart[] = JSON.parse(
      sessionStorage.getItem('cart') || '[]'
    );

    const index = cartStorage.findIndex((cart) => cart.product.id === id);

    if (index > -1) {
      return;
    }

    sessionStorage.setItem(
      'cart',
      JSON.stringify([
        ...cartStorage,
        { product, qty: countRef.current?.value, isSelected: false },
      ])
    );
  };

  const redirectToCart = () => {
    router.push('/cart');
  };

  const onClickPurchase = () => {
    sessionStorage.setItem(
      'purchase',
      JSON.stringify([{ product, qty: countRef.current?.value }])
    );
    router.push('/purchase');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="h-[80%] flex flex-col items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <p className="text-sm text-gray-400">{product.brand}</p>
        </div>

        <div className="w-full flex flex-col items-start">
          <p>{product.description}</p>
          <div className="w-full mt-8 flex items-center justify-between">
            <input
              type="number"
              min={1}
              className="px-4 border h-10"
              defaultValue={1}
              ref={countRef}
            />
            <p className="font-bold">{product.price.toLocaleString()}원</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-1/2 h-16 bg-neutral-400 rounded cursor-pointer hover:bg-neutral-500"
              onClick={onAddCart.bind(null, product.id)}
            >
              <ShoppingBasket />
              장바구니 담기
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>장바구니로 이동하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                상품을 더 둘러보시려면 아니오를 눌러주세요.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>아니오</AlertDialogCancel>
              <AlertDialogAction onClick={redirectToCart}>예</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Link href="/purchase" className="block w-1/2">
          <Button
            className="w-full h-16 bg-blue-950 hover:bg-blue-900 text-white rounded cursor-pointer"
            onClick={onClickPurchase}
          >
            구매하기
          </Button>
        </Link>
      </div>
    </div>
  );
}
