import { getProductsByPagination } from "@/actions/products";
import ProductList from "@/components/product/product-list";
import CustomPagination from "@/components/ui/custom-pagination";
import { getTotalPage } from "@/lib/utils";

interface ProductListPageProps {
  params: Promise<{
    sex: string;
    category: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ITEMS_PER_PAGE = 8;

export const generateMetadata = async ({ params }: ProductListPageProps) => {
  const { sex, category } = await params;
  return {
    title: `${sex}/${category} | 5ot Next`,
    description: `${sex}/${category} 카테고리 페이지 입니다.`,
  };
};

export default async function ProductListPage({ params, searchParams }: ProductListPageProps) {
  const { sex, category } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const { data, count: totalCount } = await getProductsByPagination(`${sex}/${category}`, {
    pageNum: currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
  });
  const totalPage = getTotalPage(totalCount || 0, ITEMS_PER_PAGE);

  return (
    <div className="h-full">
      <h2 className="text-3xl font-bold my-4">
        {sex === "men" ? "남성" : "여성"} {category}
      </h2>
      {/* product list */}
      <div>
        <ProductList page={currentPage} category={`${sex}/${category}`} initialData={data} />
        {!!totalCount && <CustomPagination currentPage={currentPage} totalPage={totalPage} />}
      </div>
    </div>
  );
}
