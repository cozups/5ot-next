import { createClient } from "@/utils/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import Image from "next/image";
import { Products } from "@/types/products";

interface CategoryProductViewProps {
  category: string;
}

export default async function CategoryProductView({ category }: CategoryProductViewProps) {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select().eq("category", category);

  return (
    <div className="h-full  bg-white rounded-2xl">
      {(!data || data.length < 1) && (
        <p className="h-full min-h-48 font-semibold flex justify-center items-center">
          해당 카테고리의 제품이 없습니다.
        </p>
      )}
      {data && data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">이름</TableHead>
              <TableHead className="text-center">제조사</TableHead>
              <TableHead className="text-center">가격</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {data.map((product: Products) => (
              <TableRow key={product.id} className="text-center">
                <TableCell className="flex gap-2 items-center">
                  <div className="w-16 h-16 bg-black relative">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="10vw" />
                  </div>
                  {product.name}
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.price.toLocaleString()}원</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
