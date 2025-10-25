"use client";
import Image from "next/image";

import UpdateProductDialog from "@/features/product/ui/update-product-dialog";
import DeleteButton from "@/components/delete-button";
import { deleteProduct, getAllProductsByPagination } from "@/features/product/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Products } from "@/types/products";
import { useQuery } from "@tanstack/react-query";

interface ProductListTableProps {
  initialData: Products[];
  currentPage: number;
}

export default function ProductListTable({ initialData, currentPage }: ProductListTableProps) {
  const { data: productList } = useQuery({
    queryKey: ["products", { page: currentPage }],
    queryFn: async () => {
      const { data } = await getAllProductsByPagination({
        pageNum: currentPage,
        itemsPerPage: 10,
      });
      return data;
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Table className="my-4">
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>제조사</TableHead>
          <TableHead>설명</TableHead>
          <TableHead>가격</TableHead>
          <TableHead>관리</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productList?.map((product: Products) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex items-center gap-2">
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
                <p>{product.name}</p>
              </div>
            </TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.brand}</TableCell>
            <TableCell className="max-w-48 break-words whitespace-normal">{product.description}</TableCell>
            <TableCell>{product.price.toLocaleString()}원</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <UpdateProductDialog product={product} />
                <DeleteButton action={deleteProduct.bind(null, product)} queryKey={["products"]} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
