"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FileImage } from "lucide-react";
import { toast } from "sonner";

import { User } from "@supabase/supabase-js";
import { useUser } from "@/hooks/use-users";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { UpdateFormState, updateUser } from "@/features/auth";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui";

const initialState: UpdateFormState = { success: false };

export default function UpdateProfileDialog({ user }: { user: User }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState(user.user_metadata.image || "/images/user.png");
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [formState, formAction] = useActionState(updateUser.bind(null, user), initialState);
  const { refetch } = useUser();
  const { invalidateCache } = useInvalidateCache(["orders"]);

  useEffect(() => {
    if (formState.success) {
      refetch();
      invalidateCache();
      toast.success("프로필이 업데이트 되었습니다.");
    }

    if (formState.errors?.name === "server") {
      toast.error("이미지 업데이트 중 문제가 발생했습니다.", {
        description: formState.errors.message,
      });
    }
  }, [formState, refetch]);

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
          <div className="w-48 h-48 rounded-full relative overflow-hidden mx-auto" onClick={onClickImage}>
            <Image
              src={imageSrc}
              fill
              className="object-cover"
              alt="profile image"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {!isChanged && (
              <div className="w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.25)] cursor-pointer rounded-full flex items-center justify-center">
                <FileImage className="text-white w-12 h-12" />
              </div>
            )}
            <Input type="file" ref={inputRef} className="none" onChange={onChangeImage} name="image" />
          </div>
          <div>
            <label htmlFor="username">이름</label>
            <Input
              type="text"
              defaultValue={user.user_metadata.username || ""}
              className="mt-2"
              name="username"
              id="username"
            />
            {formState.errors?.errors?.username?.map((error) => (
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
