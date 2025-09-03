"use client";

import { LoginFormState, loginUser } from "@/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export const metadata = {
  title: "로그인 | 5ot Next",
  description: "로그인 페이지 입니다.",
};

const initialState: LoginFormState = {
  success: false,
};

export default function LoginPage() {
  const [state, formAction] = useActionState(loginUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success("로그인 되었습니다.");
      router.replace("/");
    }
    if (state.errors?.loginError) {
      toast.error("로그인에 실패했습니다.", {
        description: state.errors.loginError[0],
      });
    }
  }, [state, router]);

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <form action={formAction} className="border-2 w-[36rem] flex flex-col items-center py-8">
        <h1 className="text-center text-2xl font-bold mb-8">Login</h1>

        <div className="w-72 flex flex-col gap-8 my-8">
          <div className="flex flex-col">
            <label htmlFor="userEmail" className="font-semibold">
              ID
            </label>
            <input
              type="text"
              id="userEmail"
              name="userEmail"
              className="border-b-2"
              defaultValue={state.values?.userEmail}
            />
            {state.errors?.userEmail?.map((msg) => (
              <p key={msg} className="text-sm text-red-600">
                {msg}
              </p>
            ))}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold">
              PW
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border-b-2"
              defaultValue={state.values?.password}
            />
            {state.errors?.password?.map((msg) => (
              <p key={msg} className="text-sm text-red-600">
                {msg}
              </p>
            ))}
          </div>
        </div>

        <button className="bg-neutral-300 w-fit py-1 px-2 rounded-sm my-2 cursor-pointer">로그인 하기</button>
        <Link href="/join" className="text-center text-xs my-2 text-neutral-600 hover:underline">
          회원이 아니신가요? 회원가입 하기
        </Link>
      </form>
    </div>
  );
}
