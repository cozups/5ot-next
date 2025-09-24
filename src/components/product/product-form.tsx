"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { insertProduct, ProductFormState } from "@/actions/products";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Category } from "@/types/category";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { getCategoriesBySex } from "@/actions/category";
import { cn } from "@/lib/utils";

const initialState: ProductFormState = { success: false };

export default function ProductForm() {
  const [formState, formAction] = useActionState(insertProduct, initialState);
  const [sex, setSex] = useState<string>("men");
  const [category, setCategory] = useState<Category[]>([]);
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { invalidateCache } = useInvalidateCache(["products"]);

  const { data, isError, error, isSuccess } = useQuery({
    queryKey: ["category", sex],
    queryFn: async () => {
      const { data } = await getCategoriesBySex(sex);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    toast.error("카테고리 목록을 불러오던 중 문제가 발생하였습니다.", {
      description: error.message,
    });
  }

  useEffect(() => {
    if (isSuccess && data) {
      setCategory(data);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      setPickedImage(null);
      setSex("men");
      toast.success("제품이 추가되었습니다.");
      invalidateCache();
    }

    if (formState.errors?.insertError) {
      toast.error("제품 추가 중 문제가 발생하였습니다.", {
        description: formState.errors.insertError[0],
      });
    }

    if (formState.errors?.imageUpload) {
      toast.error("제품 이미지 업로드 중 문제가 발생하였습니다.", {
        description: formState.errors.imageUpload[0],
      });
    }
  }, [formState, invalidateCache]);

  const onChangeSelect = (value: string) => {
    setSex(value);
  };

  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPickedImage(fileReader.result as string);
    };

    fileReader.readAsDataURL(file);
  };

  return (
    <form action={formAction} className="bg-blue-50 px-6 py-4 rounded-2xl my-4" ref={formRef}>
      <div className={cn("w-full flex justify-center gap-8 mb-4 flex-col", "md:flex-row md:items-center")}>
        <div className={cn("w-full flex flex-col gap-4", "md:w-1/2")}>
          <div>
            <label htmlFor="name">제품명</label>
            <Input type="text" name="name" id="name" className="bg-white" defaultValue={formState?.values?.name} />
            {<p className="text-red-500 text-sm">{formState?.errors?.name}</p>}
          </div>
          <div>
            <label htmlFor="brand">제조사</label>
            <Input type="text" name="brand" id="brand" className="bg-white" defaultValue={formState?.values?.brand} />
            {<p className="text-red-500 text-sm">{formState?.errors?.brand}</p>}
          </div>
          <div>
            <label htmlFor="price">가격</label>
            <Input
              type="number"
              name="price"
              id="price"
              min={0}
              defaultValue={formState?.values?.price}
              className="bg-white"
            />
            {<p className="text-red-500 text-sm">{formState?.errors?.price}</p>}
          </div>
          <div>
            <label htmlFor="description">제품 설명</label>
            <Input
              type="text"
              name="description"
              id="description"
              defaultValue={formState?.values?.description}
              className="bg-white"
            />
            {<p className="text-red-500 text-sm">{formState?.errors?.description}</p>}
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="category">성별</label>
              <Select name="sex" onValueChange={onChangeSelect}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="성별" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">남성</SelectItem>
                  <SelectItem value="women">여성</SelectItem>
                </SelectContent>
              </Select>
              {<p className="text-red-500 text-sm">{formState?.errors?.sex}</p>}
            </div>
            <div>
              <label htmlFor="category">카테고리</label>
              <Select name="category">
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  {category.map((cat) => (
                    <SelectItem key={`${sex}/${cat.name}`} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {<p className="text-red-500 text-sm">{formState?.errors?.category}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="image">제품 이미지</label>
            <Input type="file" name="image" className="bg-white" id="image" onChange={onChangeImage} />
            <p className="text-xs text-gray-500 mt-1">1MB 이하의 이미지만 삽입해주세요.</p>
            {<p className="text-red-500 text-sm">{formState?.errors?.image}</p>}
          </div>
        </div>
        <div className={cn("w-36 aspect-square bg-slate-500 relative", "md:flex-1")}>
          {pickedImage && (
            <Image
              src={pickedImage}
              fill
              alt="product image"
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 50vw)"
            />
          )}
        </div>
      </div>
      <Button>추가</Button>
    </form>
  );
}
