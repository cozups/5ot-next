import { getCategory } from "@/features/category";
import { createClient } from "@/utils/supabase/server";

interface ProductListLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

export const generateMetadata = async ({ params }: ProductListLayoutProps) => {
  const supabase = await createClient();
  const { id } = await params;
  const { data } = await getCategory(supabase, id);

  return {
    title: `${data?.sex}/${data?.name} | 5ot Next`,
    description: `${data?.sex}/${data?.name} 카테고리 페이지 입니다.`,
  };
};

export default async function ProductListLayout({ children, params }: ProductListLayoutProps) {
  const supabase = await createClient();
  const { id } = await params;
  const { data } = await getCategory(supabase, id);

  return (
    <div className="h-full">
      <h2 className="text-3xl font-bold my-4">
        {data?.sex === "men" ? "남성" : "여성"} {data?.name}
      </h2>
      {children}
    </div>
  );
}
