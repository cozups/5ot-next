import { Button } from '@/components/ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col justify-center items-center gap-8">
      <h1 className="text-6xl font-black">존재하지 않는 페이지입니다.</h1>
      <Link href="/">
        <Button className="cursor-pointer">홈으로 돌아가기</Button>
      </Link>
    </div>
  );
}
