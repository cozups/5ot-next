import Link from "next/link";

import { Products } from "@/types/products";
import { cn, getTotalPage } from "@/lib/utils";
import ProductItem from "./product-item";
import { getProductsByPagination } from "@/actions/products";
import CustomPagination from "../ui/custom-pagination";

const ITEMS_PER_PAGE = 8;

export default async function ProductList({ category, currentPage }: { category: string; currentPage: number }) {
  const { data, count: totalCount } = await getProductsByPagination(category, {
    pageNum: currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
  });
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
          <Link key={product.name} href={`/${category}/${product.id}`} prefetch>
            <ProductItem product={product} />
          </Link>
        ))}
      </div>
      {!!totalCount && <CustomPagination currentPage={currentPage} totalPage={totalPage} />}
    </div>
  );
}
