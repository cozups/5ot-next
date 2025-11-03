"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { useUser } from "@/hooks/use-users";
import { loginUser } from "@/features/auth";
import { Button, Spinner } from "@/components/ui";
import { generateFormData } from "@/lib/generate-form-data";
import { LoginFormData, loginFormSchema } from "@/lib/validations-schema/auth";
import { useFormTransition } from "@/hooks/use-form-transition";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginFormSchema) });

  const router = useRouter();
  const { refetch } = useUser();

  const { isPending, execute } = useFormTransition(loginUser, {
    onSuccessText: ["로그인 되었습니다"],
    onSuccess: () => {
      refetch();
      router.replace("/");
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    const formData = generateFormData(data);
    execute(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border-2 w-[36rem] flex flex-col items-center py-8">
      <h1 className="text-center text-2xl font-bold mb-8">Login</h1>

      <div className="w-72 flex flex-col gap-8 my-8">
        <div className="flex flex-col">
          <label htmlFor="userEmail" className="font-semibold">
            ID
          </label>
          <input {...register("userEmail")} className="border-b-2" />
          {errors.userEmail && <p className="text-sm text-red-600">{errors.userEmail.message}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="font-semibold">
            PW
          </label>
          <input {...register("password")} type="password" className="border-b-2" />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-28" disabled={isPending}>
        {isPending ? <Spinner /> : "로그인 하기"}
      </Button>
      <Link href="/join" className="text-center text-xs my-2 text-neutral-600 hover:underline">
        회원이 아니신가요? 회원가입 하기
      </Link>
    </form>
  );
}
