import LoginForm from "@/features/auth/ui/login-form";

export const metadata = {
  title: "로그인 | 5ot Next",
  description: "로그인 페이지 입니다.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
