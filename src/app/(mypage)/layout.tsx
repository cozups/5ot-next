import MyPageSideBar from '@/components/mypage-side-bar';

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr_4fr_1fr]">
      <MyPageSideBar />
      {children}
    </div>
  );
}
