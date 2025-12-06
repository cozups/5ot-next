"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { FileImage } from "lucide-react";

import { User } from "@supabase/supabase-js";
import { useUser } from "@/hooks/use-users";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { updateUser } from "@/features/auth";
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
  Spinner,
} from "@/components/ui";
import { useFormTransition } from "@/hooks/use-form-transition";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileFormData, updateProfileFormSchema } from "@/lib/validations-schema/auth";
import { generateFormData } from "@/lib/generate-form-data";

export default function UpdateProfileDialog({ user }: { user: User }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState(user.user_metadata.image || "/images/user.png");
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const { refetch } = useUser();
  const { invalidateCache } = useInvalidateCache(["orders"]);
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, execute } = useFormTransition(updateUser.bind(null, user), {
    onSuccess: () => {
      refetch();
      invalidateCache();
      setIsOpen(false);
    },
    onSuccessText: ["프로필이 업데이트 되었습니다."],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      username: user.user_metadata.username || "",
      image: null,
    },
  });

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

  const onSubmit: SubmitHandler<UpdateProfileFormData> = (data) => {
    const formData = generateFormData(data);
    execute(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">프로필 수정</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>프로필 수정하기</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="w-48 h-48 rounded-full relative overflow-hidden mx-auto" onClick={onClickImage}>
            <Image
              src={imageSrc}
              fill
              className="object-cover"
              alt={`${user.user_metadata.username}님의 프로필 이미지`}
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
            <Input {...register("username")} className="mt-2" />
            {errors.username && <p className="text-sm text-red-400">{errors.username.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                취소
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer w-16" disabled={isPending}>
              {isPending ? <Spinner /> : "수정"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
