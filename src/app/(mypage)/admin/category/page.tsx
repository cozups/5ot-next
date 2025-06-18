import { createCategory, deleteCategory } from '@/actions/category';
import CategoryProductView from '@/components/category-product-view';
import DeleteButton from '@/components/delete-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function CategoryManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.from('category').select();

  const womenCategories = data?.filter((cat) => cat.sex === 'women');
  const menCategories = data?.filter((cat) => cat.sex === 'men');

  const selected = ((await searchParams).selected as string) || '';

  return (
    <div className="min-h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold">카테고리 관리</h1>
      <div className=" grid grid-cols-2 gap-8">
        <div>
          {/* 카테고리 추가 */}
          <div className="bg-slate-200 py-4 px-6 rounded-2xl my-8 mx-auto">
            <form action={createCategory} className="flex flex-col gap-4">
              <p className="text-lg font-semibold">카테고리 추가</p>
              <div className="flex items-center gap-4">
                <Input type="text" name="categoryName" className="bg-white" />
                <Select name="categorySex">
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="성별" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">남성</SelectItem>
                    <SelectItem value="women">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="cursor-pointer self-end w-fit"
              >
                추가
              </Button>
            </form>
          </div>

          {/* 카테고리 데이터*/}
          {!data && <div>데이터가 존재하지 않습니다.</div>}
          {data && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mt-4 mb-2">Men</h2>
              <Table className="text-center">
                <TableBody>
                  {menCategories?.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Link
                          href={`?selected=${cat.sex}-${cat.name}`}
                          className=""
                        >
                          <Button>상품 보기</Button>
                        </Link>
                        <DeleteButton
                          action={deleteCategory.bind(null, cat.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <h2 className="text-xl font-semibold mt-4 mb-2">Women</h2>
              <Table className="text-center">
                <TableBody>
                  {womenCategories?.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Link
                          href={`?selected=${cat.sex}-${cat.name}`}
                          className=""
                        >
                          <Button>상품 보기</Button>
                        </Link>
                        <DeleteButton
                          action={deleteCategory.bind(null, cat.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* 카테고리 별 제품 */}
        <div className="w-full h-full bg-slate-50 rounded-2xl p-4">
          <CategoryProductView category={selected.replace('-', '/')} />
        </div>
      </div>
    </div>
  );
}
