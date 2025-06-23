'use client';

import { Products } from '@/types/products';
import Image from 'next/image';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useActionState, useEffect, useRef, useState } from 'react';
import { FormState, updateProduct } from '@/actions/products';
import { Category } from '@/types/category';
import { createClient } from '@/utils/supabase/client';

const initialState: FormState = { success: false };

export default function UpdateProductForm({
  product,
  children,
}: {
  product: Products;
  children: React.ReactNode;
}) {
  const [formState, formAction] = useActionState(
    updateProduct.bind(null, product),
    initialState
  );
  const [defaultSex, defaultCategory] = product.category.split('/');

  const [sex, setSex] = useState<string>(defaultSex);
  const [category, setCategory] = useState<Category[]>([]);
  const [pickedImage, setPickedImage] = useState<string | null>(
    product.image || null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const getCategory = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('category').select().eq('sex', sex);

      if (data) {
        setCategory(data);
      }
    };

    getCategory();
  }, [sex]);

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      setPickedImage(null);
    }
  }, [formState]);

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
    <form action={formAction}>
      <div className="flex items-end gap-2">
        <div className="w-48 aspect-square relative">
          {pickedImage && (
            <Image
              src={pickedImage}
              fill
              alt="product image"
              className="object-cover"
            />
          )}
        </div>
        <Input
          type="file"
          name="image"
          className="w-1/2"
          onChange={onChangeImage}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="name">제품명</label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={product.name}
          />
          {<p className="text-red-500 text-sm">{formState.errors?.name}</p>}
        </div>
        <div>
          <label htmlFor="brand">제조사</label>
          <Input
            type="text"
            id="brand"
            name="brand"
            defaultValue={product.brand}
          />
          {<p className="text-red-500 text-sm">{formState.errors?.brand}</p>}
        </div>
        <div>
          <label htmlFor="brapricend">가격</label>
          <Input
            type="number"
            id="price"
            name="price"
            defaultValue={product.price}
          />
          {<p className="text-red-500 text-sm">{formState.errors?.price}</p>}
        </div>
        <div>
          <label htmlFor="description">제품 설명</label>
          <Input
            type="text"
            id="description"
            name="description"
            defaultValue={product.description}
          />
          {
            <p className="text-red-500 text-sm">
              {formState.errors?.description}
            </p>
          }
        </div>
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="category">성별</label>
            <Select
              name="sex"
              defaultValue={defaultSex}
              onValueChange={onChangeSelect}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="성별" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men">남성</SelectItem>
                <SelectItem value="women">여성</SelectItem>
              </SelectContent>
            </Select>
            {<p className="text-red-500 text-sm">{formState.errors?.sex}</p>}
          </div>
          <div>
            <label htmlFor="category">카테고리</label>
            <Select name="category" defaultValue={defaultCategory}>
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
            {
              <p className="text-red-500 text-sm">
                {formState?.errors?.category}
              </p>
            }
          </div>
        </div>
      </div>
      {children}
    </form>
  );
}
