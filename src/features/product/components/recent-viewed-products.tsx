"use client";

import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RecentProducts {
  id: string;
  name: string;
  image: string;
  price: string;
}

export default function RecentViewedProducts() {
  const [products, setProducts] = useState<RecentProducts[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("recentViewedProducts");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

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
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-16 aspect-square relative">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={`${product.name} image`}
                          fill
                          className="object-cover"
                          sizes="10vw"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price.toLocaleString()}원</TableCell>
                  <TableCell>
                    <Link href={`/product/${product.id}`}>
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
