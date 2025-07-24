import { getProductsByPagination } from '@/actions/products';
import ProductList from '@/components/product/product-list';
import CustomPagination from '@/components/ui/custom-pagination';
import { cn, getTotalPage } from '@/lib/utils';

interface ProductListPageProps {
  params: Promise<{
    sex: string;
    category: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductListPage({
  params,
  searchParams,
}: ProductListPageProps) {
  const { sex, category } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const itemsPerPage = 8;

  const { data, count: totalCount } = await getProductsByPagination(
    `${sex}/${category}`,
    {
      pageNum: currentPage,
      itemsPerPage,
    }
  );
  const totalPage = getTotalPage(totalCount || 0, itemsPerPage);

  return (
    <div className="h-full">
      <h2 className="text-3xl font-bold my-4">
        {sex === 'men' ? '남성' : '여성'} {category}
      </h2>
      {/* product list */}
      <ProductList
        page={currentPage}
        category={`${sex}/${category}`}
        initialData={data}
      />
      {!!totalCount && (
        <CustomPagination currentPage={currentPage} totalPage={totalPage} />
      )}
    </div>
  );
}
