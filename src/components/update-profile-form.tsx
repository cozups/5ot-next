'use client';

import { FileImage } from 'lucide-react';
import Image from 'next/image';
import { Input } from './ui/input';
import React, { useActionState, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { DialogClose, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { UpdateFormState, updateUser } from '@/actions/auth';

const initialState: UpdateFormState = { success: false };

export default function UpdateProfileForm({ user }: { user: User }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState(
    user.user_metadata.image || '/images/user.png'
  );
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [formState, formAction] = useActionState(
    updateUser.bind(null, user.id),
    initialState
  );

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
  );
}
