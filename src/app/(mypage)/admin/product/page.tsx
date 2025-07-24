import { deleteProduct, getAllProductsByPagination } from '@/actions/products';
import DeleteButton from '@/components/delete-button';
import ProductForm from '@/components/product/product-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Products } from '@/types/products';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import UpdateProductDialog from '@/components/product/update-product-dialog';
import CustomPagination from '@/components/ui/custom-pagination';
import { getTotalPage } from '@/lib/utils';

interface ProductManagementPageProps {
  searchParams: Promise<{
    page: string;
  }>;
}

export default async function ProductManagementPage({
  searchParams,
}: ProductManagementPageProps) {
  const page = await searchParams;
  const currentPage = Number(page) || 1;
  const { data: productList, count: totalCount } =
    await getAllProductsByPagination({
      pageNum: currentPage,
      itemsPerPage: 10,
    });

  const totalPage = getTotalPage(totalCount, 10);

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
              {productList?.map((product: Products) => (
                <TableRow key={product.id}>
                  <TableCell className="flex items-center gap-2">
                    <div className="w-16 aspect-square relative">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={`${product.name} image`}
                          fill
                          className="object-cover"
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
                      <UpdateProductDialog product={product} />
                      <DeleteButton
                        action={deleteProduct.bind(null, product)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {productList && productList.length < 1 && (
            <p className="text-center font-semibold">등록된 제품이 없습니다.</p>
          )}
          {!!productList?.length && (
            <CustomPagination currentPage={currentPage} totalPage={totalPage} />
          )}
        </div>
      </div>
    </div>
  );
}
