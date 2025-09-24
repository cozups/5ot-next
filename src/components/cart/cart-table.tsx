"use client";

import Image from "next/image";
import { Trash } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store";
import { Cart } from "@/types/cart";

export default function CartTable() {
  const { data: cartData, setData: setCartData } = useCartStore();

  const toggleCart = (id: string) => {
    const updated = cartData.map((cart) => (cart.product.id === id ? { ...cart, isSelected: !cart.isSelected } : cart));
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartData(updated);
  };

  const onChangeQty = (cart: Cart, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = event.target.value;
    const index = cartData.findIndex((data) => data.product.id === cart.product.id);

    if (index > -1) {
      const updated = [...cartData];
      updated[index] = { ...updated[index], qty: newQty };
      localStorage.setItem("cart", JSON.stringify(updated));
      setCartData(updated);
    }
  };

  const onDeleteCart = (id: string) => {
    const updated = cartData.filter((data) => data.product.id !== id);
    setCartData(updated);

    if (!updated.length) {
      localStorage.removeItem("cart");
      setCartData([]);
      return;
    }
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartData(updated);
  };

  return (
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
                <Checkbox defaultChecked={cart.isSelected} onCheckedChange={toggleCart.bind(null, cart.product.id)} />
              </TableCell>
              <TableCell className="flex items-center gap-4">
                <div className="w-16 aspect-square relative">
                  <Image src={cart.product.image} fill alt={cart.product.name} className="object-cover" sizes="10vw" />
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
  );
}
