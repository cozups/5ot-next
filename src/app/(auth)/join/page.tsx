import JoinForm from "@/features/auth/ui/join-form";

export const metadata = {
  title: "회원가입 | 5ot Next",
  description: "회원가입 페이지 입니다.",
};

export default function JoinPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <JoinForm />
    </div>
  );
}
