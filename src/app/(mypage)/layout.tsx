import MyPageSideBar from "@/components/mypage-side-bar";

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <MyPageSideBar />
      {children}
    </div>
  );
}
