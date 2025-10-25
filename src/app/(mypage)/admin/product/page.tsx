import { getCategoriesBySex } from "@/features/category/actions";
import { getAllProductsByPagination } from "@/features/product/actions";
import ProductForm from "@/features/product/ui/product-form";
import ProductListTable from "@/features/product/ui/product-list-table";

import CustomPagination from "@/components/ui/custom-pagination";
import { getTotalPage } from "@/lib/utils";

interface ProductManagementPageProps {
  searchParams: Promise<{
    page: string;
  }>;
}

export default async function ProductManagementPage({ searchParams }: ProductManagementPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const { data: productList, count: totalCount } = await getAllProductsByPagination({
    pageNum: currentPage,
    itemsPerPage: 10,
  });

  const [menCategory, womenCategory] = await Promise.all([getCategoriesBySex("men"), getCategoriesBySex("women")]);

  const totalPage = getTotalPage(totalCount, 10);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold my-2">제품 관리</h1>
      <div className="w-full">
        {/* 제품 추가 폼 */}
        <ProductForm categories={{ men: menCategory.data || [], women: womenCategory.data || [] }} />

        {/* 제품 리스트 */}
        <div>
          <h2 className="text-2xl font-bold">제품 리스트</h2>
          {totalCount > 0 && <ProductListTable initialData={productList || []} currentPage={currentPage} />}
          {/* 페이지네이션 */}
          {totalCount === 0 && <p className="text-center font-semibold">등록된 제품이 없습니다.</p>}
          {!!productList?.length && <CustomPagination currentPage={currentPage} totalPage={totalPage} />}
        </div>
      </div>
    </div>
  );
}
