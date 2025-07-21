'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { logout } from '@/actions/auth';
import { Button } from './ui';

export default function LogoutButton() {
  const router = useRouter();

  const onClickLogout = async () => {
    const result = await logout();

    if (result.success) {
      toast.success('로그아웃 되었습니다.');
      router.push('/');
    }

    if (result.errors?.logoutError) {
      toast.error('로그아웃에 실패했습니다.', {
        description: result.errors.logoutError[0],
      });
    }
  };
  return (
    <Button className="cursor-pointer" onClick={onClickLogout}>
      로그아웃
    </Button>
  );
}
