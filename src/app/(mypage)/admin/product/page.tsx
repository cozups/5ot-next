import ProductForm from '@/components/product-form';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ProductManagementPage() {
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
          </Table>
        </div>
      </div>
    </div>
  );
}
