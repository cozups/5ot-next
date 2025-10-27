"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { useUser } from "@/hooks/use-users";
import { createUser } from "@/features/auth";
import { Button, Spinner } from "@/components/ui";
import { generateFormData } from "@/lib/generate-form-data";
import { JoinFormData, joinFormSchema } from "@/lib/validations-schema/auth";

export default function JoinForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinFormData>({ resolver: zodResolver(joinFormSchema) });
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { refetch } = useUser();

  const onSubmit: SubmitHandler<JoinFormData> = (data) => {
    const formData = generateFormData(data);

    startTransition(async () => {
      const result = await createUser(formData);

      if (result.success) {
        toast.success("회원가입에 성공했습니다.", {
          description: "자동으로 로그인 되었습니다.",
        });
        refetch();
        router.push("/");
      }

      if (result.errors) {
        toast.error("회원가입에 실패했습니다.", {
          description: result.errors.message,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border-2 w-[36rem] flex flex-col items-center py-8">
      <h1 className="text-center text-2xl font-bold mb-8">Join</h1>

      <div className="w-72 flex flex-col gap-8 my-8">
        <div className="flex flex-col">
          <label htmlFor="username" className="font-semibold">
            이름
          </label>
          <input {...register("username")} className="border-b-2" />
          {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone" className="font-semibold">
            전화번호
          </label>
          <input {...register("phone")} maxLength={11} className="border-b-2" />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="userEmail" className="font-semibold">
            Email
          </label>
          <input {...register("userEmail")} className="border-b-2" />
          {errors.userEmail && <p className="text-sm text-red-600">{errors.userEmail.message}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="font-semibold">
            Password
          </label>
          <input {...register("password")} type="password" className="border-b-2" />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
      </div>
      <Button type="submit" className="w-28" disabled={isPending}>
        {isPending ? <Spinner /> : "회원가입 하기"}
      </Button>
      <Link href="/login" className="text-center text-xs my-2 text-neutral-600 hover:underline">
        이미 회원이신가요? 로그인 하기
      </Link>
    </form>
  );
}
