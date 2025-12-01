"use client";

import Image from "next/image";
import { Trash } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { Cart } from "@/types/cart";
import { useUser } from "@/hooks/use-users";
import { toast } from "sonner";
import { useTransition } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";

export default function CartTable() {
  const { data, removeItem, updateQty, toggleCart } = useCartStore();
  const { user } = useUser();
  const [, startTransition] = useTransition();

  const onChangeQty = async (cart: Cart, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = event.target.value;

    startTransition(async () => {
      try {
        updateQty(cart.product.id, newQty, user?.id);
      } catch (error: unknown) {
        toast.error((error as Error).message);
      }
    });
  };

  const onRemoveItem = async (productId: string) => {
    startTransition(async () => {
      try {
        removeItem(productId, user?.id);
      } catch (error: unknown) {
        toast.error((error as Error).message);
      }
    });
  };

  const onToggleSelection = async (checked: CheckedState, cartItem: Cart) => {
    toggleCart(!!checked, cartItem.product.id);
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
          {data.map((cart) => (
            <TableRow key={cart.product.id}>
              <TableCell>
                <Checkbox
                  defaultChecked={cart.isSelected}
                  onCheckedChange={(checked: CheckedState) => onToggleSelection(checked, cart)}
                />
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
                    onClick={() => onRemoveItem(cart.product.id)}
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
