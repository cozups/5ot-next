"use client";

import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useUser } from "@/hooks/use-users";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecentViewedProducts } from "../queries";
import { RecentProducts } from "@/types/products";

export default function RecentViewedProducts() {
  const [products, setProducts] = useState<RecentProducts[]>([]);
  const { user } = useUser();

  useEffect(() => {
    async function fetchRecentViewedProducts() {
      // DB에서 최근 본 상품 불러오기
      const supabase = createClient();
      const { success, data } = await getRecentViewedProducts(supabase, user!.id);

      if (success) {
        setProducts(data || []);
      }
    }

    if (user) {
      fetchRecentViewedProducts();
    }
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold my-2">최근 본 상품</h1>
      <div>
        <p className="text-sm text-gray-500">최근 본 최대 10개의 상품을 표시합니다.</p>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이미지</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>바로가기</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell>
                    <div className="w-16 aspect-square relative">
                      {item.product.image && (
                        <Image
                          src={item.product.image}
                          alt={`${item.product.name} image`}
                          fill
                          className="object-cover"
                          sizes="10vw"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.product.price.toLocaleString()}원</TableCell>
                  <TableCell>
                    <Link href={`/product/${item.product.id}`}>
                      <Button>바로가기</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
