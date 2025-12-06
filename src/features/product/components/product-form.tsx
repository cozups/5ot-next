"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { insertProduct } from "../actions";
import { generateFormData } from "@/lib/generate-form-data";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { useCategory } from "@/features/category/hooks/use-category";
import { ProductFormData, productFormSchema } from "@/lib/validations-schema/product";
import { Spinner, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input, Button } from "@/components/ui";
import { useFormTransition } from "@/hooks/use-form-transition";
import ImagePreview from "@/components/ui/image-preview";
import { useImagePreview } from "@/hooks/use-image-preview";

export default function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ProductFormData>({ resolver: zodResolver(productFormSchema) });

  const [sex, setSex] = useState<"men" | "women">("men");
  const categories = useCategory();
  const { pickedImage, onChangeImage, resetImage } = useImagePreview();
  const { invalidateCache } = useInvalidateCache(["products"]);
  const { isPending, execute } = useFormTransition(insertProduct, {
    onSuccess: () => {
      resetImage();
      setSex("men");
      reset();
      invalidateCache();
    },
    onSuccessText: ["제품이 추가되었습니다."],
  });

  const onSubmit: SubmitHandler<ProductFormData> = (data) => {
    const formData = generateFormData(data);
    execute(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-blue-50 px-6 py-4 rounded-2xl my-4">
      <div className={cn("w-full flex justify-center gap-8 mb-4 flex-col", "md:flex-row md:items-center")}>
        <div className={cn("w-full flex flex-col gap-4", "md:w-1/2")}>
          <div>
            <label htmlFor="name">제품명</label>
            <Input {...register("name")} className="bg-white" />
            {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="brand">제조사</label>
            <Input {...register("brand")} className="bg-white" />
            {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
          </div>
          <div>
            <label htmlFor="price">가격</label>
            <Input {...register("price")} type="number" min={0} className="bg-white" />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          <div>
            <label htmlFor="description">제품 설명</label>
            <Input {...register("description")} className="bg-white" />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <div>
            <div className="flex items-center gap-4">
              <div>
                <label htmlFor="category">성별</label>
                <Controller
                  name="sex"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={(value: "men" | "women") => {
                        field.onChange(value);
                        setSex(value);
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="성별" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="men">남성</SelectItem>
                        <SelectItem value="women">여성</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <label htmlFor="category">카테고리</label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="카테고리" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories[sex].map((cat) => (
                          <SelectItem key={`${sex}/${cat.name}`} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            {(errors.sex || errors.category) && (
              <div>
                {errors.sex && <p className="text-red-500 text-sm">{errors.sex.message}</p>}
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="image">제품 이미지</label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <Input
                  name={field.name}
                  type="file"
                  accept="image/*"
                  className="bg-white"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                    onChangeImage(e);
                  }}
                />
              )}
            />

            <p className="text-xs text-gray-500 mt-1">1MB 이하의 이미지만 삽입해주세요.</p>
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
          </div>
        </div>
        <ImagePreview
          src={pickedImage}
          alt="새로 등록할 제품의 사진"
          sizes="(max-width: 768px) 33vw, 50vw"
          className="w-36 md:flex-1"
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-16">
        {isPending ? <Spinner /> : "추가"}
      </Button>
    </form>
  );
}
