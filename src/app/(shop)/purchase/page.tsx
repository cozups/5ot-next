"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Purchase } from "@/types/orders";
import OrderForm from "@/features/order/ui/order-form";

export default function PurchasePage() {
  const [purchaseData, setPurchaseData] = useState<Purchase[]>([]);

  useEffect(() => {
    const purchaseStorage: Purchase[] = JSON.parse(sessionStorage.getItem("purchase") || "[]");
    setPurchaseData(purchaseStorage);
  }, []);

  const totalPrice = purchaseData.reduce((acc, data) => acc + parseInt(data.product.price) * parseInt(data.qty), 0);

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
                          sizes="10vw"
                        />
                      </div>
                      <p>{data.product.name}</p>
                    </TableCell>
                    <TableCell>{data.product.price.toLocaleString()}원</TableCell>
                    <TableCell>{data.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="h-1 bg-gray-300" />
          <p className="self-end font-semibold">총 {totalPrice.toLocaleString()}원</p>
        </div>
        {/* 구매 폼 */}
        <div className="bg-slate-100 rounded-2xl p-6">
          <OrderForm />
        </div>
      </div>
    </div>
  );
}
