"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { createCategory } from "../actions";
import { generateFormData } from "@/lib/generate-form-data";
import { useFormTransition } from "@/hooks/use-form-transition";
import { CategoryFormData, categoryFormSchema } from "@/lib/validations-schema/category";
import { Input, Button, Spinner, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

export default function CategoryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CategoryFormData>({ resolver: zodResolver(categoryFormSchema) });
  const { isPending, execute } = useFormTransition(createCategory, {
    onSuccess: () => reset({ name: "", sex: "" }),
    onSuccessText: ["카테고리가 추가되었습니다."],
  });

  const onSubmit: SubmitHandler<CategoryFormData> = (data) => {
    const formData = generateFormData(data);
    execute(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-lg font-semibold">카테고리 추가</p>
      <div className="flex items-center gap-4">
        <Input {...register("name")} className="bg-white" />
        <Controller
          name="sex"
          control={control}
          render={({ field }) => (
            <Select {...field} onValueChange={field.onChange} value={field.value || ""}>
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
      <div className="flex justify-between items-end">
        <div>
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          {errors.sex && <p className="text-sm text-red-600">{errors.sex.message}</p>}
        </div>
        <Button variant="outline" className="cursor-pointer w-18" disabled={isPending}>
          {isPending ? <Spinner /> : "추가"}
        </Button>
      </div>
    </form>
  );
}
