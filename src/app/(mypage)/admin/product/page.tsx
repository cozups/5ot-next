import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ProductManagementPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold">제품 관리</h1>
      <div className="w-full">
        {/* 제품 추가 폼 */}
        <form action="" className="bg-blue-50 px-6 py-4 rounded-2xl my-4">
          <div className="w-full flex items-center gap-8 mb-4">
            <div className="w-[70%] flex flex-col gap-4">
              <div>
                <label htmlFor="name">제품명</label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  className="w-[80%] bg-white"
                />
              </div>
              <div>
                <label htmlFor="brand">제조사</label>
                <Input
                  type="text"
                  name="brand"
                  id="brand"
                  className="w-[80%] bg-white"
                />
              </div>
              <div>
                <label htmlFor="price">가격</label>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  min={0}
                  className="w-[80%] bg-white"
                />
              </div>
              <div>
                <label htmlFor="image">제품 이미지</label>
                <Input
                  type="file"
                  name="image"
                  className="w-fit bg-white"
                  id="image"
                />
              </div>
            </div>
            <div className="flex-1 aspect-square bg-slate-500"></div>
          </div>
          <Button>추가</Button>
        </form>

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
