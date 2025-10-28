import Link from "next/link";

import { Products } from "@/types/products";
import { cn, getTotalPage } from "@/lib/utils";
import ProductItem from "./product-item";
import { getProductsByPagination } from "@/features/product/queries";
import CustomPagination from "../../../components/ui/custom-pagination";
import { createClient } from "@/utils/supabase/server";

const ITEMS_PER_PAGE = 8;

export default async function ProductList({ categoryId, currentPage }: { categoryId: string; currentPage: number }) {
  const supabase = await createClient();
  const {
    data,
    count: totalCount,
    errors,
  } = await getProductsByPagination(supabase, categoryId, {
    pageNum: currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  if (errors) {
    throw new Error(errors.message);
  }

  const totalPage = getTotalPage(totalCount || 0, ITEMS_PER_PAGE);

  return (
    <div>
      <div
        className={cn(
          "w-full h-full grid grid-cols-2 grid-rows-2 gap-6",
          data && data.length > 0 && "md:grid-cols-4 md:grid-rows-2",
          data?.length === 0 && "grid-cols-1 grid-rows-1 justify-center items-center h-[calc(100%-5rem)] text-center"
        )}
      >
        {data?.length === 0 && (
          <div className="w-full h-96 flex justify-center items-center">
            <h2>해당 카테고리의 제품이 존재하지 않습니다.</h2>
          </div>
        )}
        {data?.map((product: Products) => (
          <Link key={product.id} href={`/product/${product.id}`} prefetch>
            <ProductItem product={product} />
          </Link>
        ))}
      </div>
      {!!totalCount && <CustomPagination currentPage={currentPage} totalPage={totalPage} />}
    </div>
  );
}
