'use client';

import Link from 'next/link';

import { createUser, JoinFormState } from '@/actions/auth';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const initialState: JoinFormState = {
  success: false,
};

export default function JoinPage() {
  const [state, formAction] = useActionState(createUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success('회원가입에 성공했습니다.', {
        description: '자동으로 로그인 되었습니다.',
      });
      router.push('/');
    }
    if (state.errors?.signUpError) {
      toast.error('회원가입에 실패했습니다.', {
        description: state.errors.signUpError[0],
      });
    }
  }, [state, router]);

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <form
        action={formAction}
        className="border-2 w-[36rem] flex flex-col items-center py-8"
      >
        <h1 className="text-center text-2xl font-bold mb-8">Join</h1>

        <div className="w-72 flex flex-col gap-8 my-8">
          <div className="flex flex-col">
            <label htmlFor="username" className="font-semibold">
              이름
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="border-b-2"
              defaultValue={state.values?.username}
            />
            {state.errors?.username?.map((msg) => (
              <p key={msg} className="text-sm text-red-600">
                {msg}
              </p>
            ))}
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="font-semibold">
              전화번호
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="border-b-2"
              defaultValue={state.values?.phone}
            />
            {state.errors?.phone?.map((msg) => (
              <p key={msg} className="text-sm text-red-600">
                {msg}
              </p>
            ))}
          </div>

          <div className="flex flex-col">
            <label htmlFor="userEmail" className="font-semibold">
              Email
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
              Password
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
        <button
          type="submit"
          className="bg-neutral-300 w-fit py-1 px-2 rounded-sm my-2 cursor-pointer"
        >
          회원가입 하기
        </button>
        <Link
          href="/login"
          className="text-center text-xs my-2 text-neutral-600 hover:underline"
        >
          이미 회원이신가요? 로그인 하기
        </Link>
      </form>
    </div>
  );
}
