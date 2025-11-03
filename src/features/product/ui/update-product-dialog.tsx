"use client";

import Image from "next/image";
import { useState } from "react";
import { Pen } from "lucide-react";

import { Products } from "@/types/products";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { updateProduct } from "@/features/product/actions";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input, Spinner } from "../../../components/ui";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { UpdateProductFormData, updateProductFormSchema } from "@/lib/validations-schema/product";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateFormData } from "@/lib/generate-form-data";
import { useFormTransition } from "@/hooks/use-form-transition";
import { useCategory } from "@/features/category/hooks/use-category";

export default function UpdateProductDialog({ product }: { product: Products }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultSex, defaultCategory] = product.category.split("/");
  const [sex, setSex] = useState<"men" | "women">(defaultSex as "men" | "women");
  const categories = useCategory();
  const [pickedImage, setPickedImage] = useState<string | undefined>(product.image || undefined);

  const { invalidateCache } = useInvalidateCache(["products"]);

  const { isPending, execute } = useFormTransition(updateProduct, {
    onSuccess: () => {
      invalidateCache();
      setIsOpen(false);
    },
    onSuccessText: ["제품이 업데이트 되었습니다."],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductFormSchema),
    defaultValues: {
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      description: product.description,
      sex,
      category: defaultCategory,
      image: pickedImage,
    },
  });

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

  const onSubmit: SubmitHandler<UpdateProductFormData> = (data) => {
    const formData = generateFormData(data);
    execute(formData, product);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Pen />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>제품 수정하기</DialogTitle>
          <DialogDescription>제품 정보를 수정합니다.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-end gap-2">
            <div className="w-48 aspect-square relative">
              {pickedImage && (
                <Image
                  src={pickedImage}
                  fill
                  alt="product image"
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              )}
            </div>
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
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="name">제품명</label>
              <Input {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="brand">제조사</label>
              <Input {...register("brand")} />
              {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
            </div>
            <div>
              <label htmlFor="brapricend">가격</label>
              <Input {...register("price")} type="number" />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
              <label htmlFor="description">제품 설명</label>
              <Input {...register("description")} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
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
                {errors.sex && <p className="text-red-500 text-sm">{errors.sex.message}</p>}
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
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">취소</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending} className="w-16">
              {isPending ? <Spinner /> : "수정"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
