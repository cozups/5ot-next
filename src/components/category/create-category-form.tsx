'use client';

import { createCategory, FormState } from '@/actions/category';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

const initialState: FormState = { success: false };

export default function CreateCategoryForm() {
  const [formState, formAction] = useActionState(createCategory, initialState);

  useEffect(() => {
    if (formState.success) {
      toast.success('카테고리가 추가되었습니다.');
    }

    if (formState.errors) {
      Object.values(formState.errors)
        .flat()
        .forEach((error) => {
          toast.error('카테고리 추가 중 문제가 발생했습니다.', {
            description: error,
          });
        });
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
      <Button variant="outline" className="cursor-pointer self-end w-fit">
        추가
      </Button>
    </form>
  );
}
