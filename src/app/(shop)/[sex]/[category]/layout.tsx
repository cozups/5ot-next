interface ProductListLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    sex: string;
    category: string;
  }>;
}

export const generateMetadata = async ({ params }: ProductListLayoutProps) => {
  const { sex, category } = await params;
  return {
    title: `${sex}/${category} | 5ot Next`,
    description: `${sex}/${category} 카테고리 페이지 입니다.`,
  };
};

export default async function ProductListLayout({ children, params }: ProductListLayoutProps) {
  const { sex, category } = await params;

  return (
    <div className="h-full">
      <h2 className="text-3xl font-bold my-4">
        {sex === "men" ? "남성" : "여성"} {category}
      </h2>
      {children}
    </div>
  );
}
