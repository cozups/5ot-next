import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <form
        action=""
        className="border-2 w-[36rem] flex flex-col items-center py-8"
      >
        <h1 className="text-center text-2xl font-bold mb-8">Login</h1>

        <div className="w-72 flex flex-col gap-8 my-8">
          <div className="flex flex-col">
            <label htmlFor="userId" className="font-semibold">
              ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              className="border-b-2"
            />
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
            />
          </div>
        </div>
        <button className="bg-neutral-300 w-fit py-1 px-2 rounded-sm my-2 cursor-pointer">
          로그인 하기
        </button>
        <Link
          href="/join"
          className="text-center text-xs my-2 text-neutral-600 hover:underline"
        >
          회원이 아니신가요? 회원가입 하기
        </Link>
      </form>
    </div>
  );
}
