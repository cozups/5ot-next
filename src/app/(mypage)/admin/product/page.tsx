import ProductForm from '@/components/product-form';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Clothes } from '@/types/clothes';
import { createClient } from '@/utils/supabase/server';
import { Pen, Trash } from 'lucide-react';
import Image from 'next/image';

export default async function ProductManagementPage() {
  const supabase = await createClient();
  const { data: productList } = await supabase.from('clothes').select();
  console.log('error');
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold">제품 관리</h1>
      <div className="w-full">
        {/* 제품 추가 폼 */}
        <ProductForm />

        {/* 제품 리스트 */}
        <div>
          <h2 className="text-2xl font-bold">제품 리스트</h2>
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
              {productList?.map((product: Clothes) => (
                <TableRow key={product.id}>
                  <TableCell className="flex items-center gap-2">
                    <div className="w-16 aspect-square relative">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={`${product.name} image`}
                          fill
                        />
                      )}
                    </div>
                    <p>{product.name}</p>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price.toLocaleString()}원</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button>
                        <Pen />
                      </Button>
                      <Button variant="destructive">
                        <Trash />
                      </Button>
                    </div>
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
