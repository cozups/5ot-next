"use client";

import { toast } from "sonner";
import { useActionState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCategory, CategoryFormState } from "@/features/category/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui";

const initialState: CategoryFormState = { success: false };

export default function CategoryForm() {
  const [formState, formAction, isPending] = useActionState(createCategory, initialState);

  useEffect(() => {
    if (formState.success) {
      toast.success("카테고리가 추가되었습니다.");
    }

    if (formState.errors?.name === "server") {
      toast.error("카테고리 추가 중 문제가 발생했습니다.", {
        description: formState.errors.message,
      });
    }

    if (formState.errors?.name === "unexpected") {
      toast.error(formState.errors.message);
    }
  }, [formState]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-lg font-semibold">카테고리 추가</p>
      <div className="flex items-center gap-4">
        <Input type="text" name="categoryName" className="bg-white" />
        <Select name="categorySex">
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="성별" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="men">남성</SelectItem>
            <SelectItem value="women">여성</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-between items-end">
        <div>
          {formState.errors?.errors?.name && (
            <p className="text-sm text-red-600">{formState.errors?.errors?.name[0]}</p>
          )}
          {formState.errors?.errors?.sex && <p className="text-sm text-red-600">{formState.errors?.errors?.sex[0]}</p>}
        </div>
        <Button variant="outline" className="cursor-pointer w-18" disabled={isPending}>
          {isPending ? <Spinner /> : "추가"}
        </Button>
      </div>
    </form>
  );
}
