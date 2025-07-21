'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FileImage } from 'lucide-react';
import { toast } from 'sonner';

import { Input } from './ui/input';
import { User } from '@supabase/supabase-js';
import { DialogClose, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { UpdateFormState, updateUser } from '@/actions/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const initialState: UpdateFormState = { success: false };

export default function UpdateProfileDialog({ user }: { user: User }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState(
    user.user_metadata.image || '/images/user.png'
  );
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [formState, formAction] = useActionState(
    updateUser.bind(null, user),
    initialState
  );

  useEffect(() => {
    if (formState.success) {
      toast.success('프로필이 업데이트 되었습니다.');
    }

    if (formState.errors?.deleteImageError) {
      toast.error('이미지 업데이트 중 문제가 발생했습니다.', {
        description: formState.errors.deleteImageError[0],
      });
    }

    if (formState.errors?.imageUpdateError) {
      toast.error('이미지 업데이트 중 문제가 발생했습니다.', {
        description: formState.errors.imageUpdateError[0],
      });
    }

    if (formState.errors?.dataUpdateError) {
      toast.error('프로필 정보 업데이트에 실패했습니다.', {
        description: formState.errors.dataUpdateError[0],
      });
    }
  }, [formState]);

  const onClickImage = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.click();
  };

  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }
    const fileReader = new FileReader();

    fileReader.onload = () => {
      setImageSrc(fileReader.result as string);
      setIsChanged(true);
    };

    fileReader.readAsDataURL(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">프로필 수정</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>프로필 수정하기</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div
            className="w-48 h-48 rounded-full relative overflow-hidden mx-auto"
            onClick={onClickImage}
          >
            <Image
              src={imageSrc}
              fill
              className="object-cover"
              alt="profile image"
            />
            {!isChanged && (
              <div className="w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.25)] cursor-pointer rounded-full flex items-center justify-center">
                <FileImage className="text-white w-12 h-12" />
              </div>
            )}
            <Input
              type="file"
              ref={inputRef}
              className="none"
              onChange={onChangeImage}
              name="image"
            />
          </div>
          <div>
            <label htmlFor="username">이름</label>
            <Input
              type="text"
              defaultValue={user.user_metadata.username || ''}
              className="mt-2"
              name="username"
              id="username"
            />
            {formState.errors?.username?.map((error) => (
              <p key={error} className="text-sm text-red-400">
                {error}
              </p>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                취소
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" className="cursor-pointer">
                수정
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
