"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Address } from "react-daum-postcode";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Purchase } from "@/types/orders";
import { useCartStore } from "@/store/cart";
import { createOrder } from "@/features/order/actions";
import AddressSearchDialog from "./address-search-dialog";
import { generateFormData } from "@/lib/generate-form-data";
import { useFormTransition } from "@/hooks/use-form-transition";
import { Spinner, Button, Input, Textarea } from "@/components/ui";
import { OrderFormData, orderFormSchema } from "@/lib/validations-schema/order";

export interface AddressResult {
  base: string;
  detail: string;
}

export default function OrderForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<OrderFormData>({ resolver: zodResolver(orderFormSchema) });

  const [purchaseData, setPurchaseData] = useState<Purchase[]>([]);

  const { updateCartAfterPurchase } = useCartStore();
  const router = useRouter();
  const { isPending, execute } = useFormTransition(createOrder, {
    onSuccess: () => {
      updateCartAfterPurchase(purchaseData);
      router.replace("/");
    },
    onSuccessText: ["주문이 완료되었습니다."],
  });

  useEffect(() => {
    const purchaseStorage: Purchase[] = JSON.parse(sessionStorage.getItem("purchase") || "[]");
    setPurchaseData(purchaseStorage);
  }, []);

  const onCompleteSearch = (data: Address) => {
    const { address: searchedAddress } = data;
    setValue("baseAddress", searchedAddress);
  };

  const onSubmit: SubmitHandler<OrderFormData> = (data) => {
    const formData = generateFormData(data);
    execute(formData, purchaseData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="receiver">받는 분</label>
          <Input {...register("receiver")} className="bg-white" />
          {errors.receiver && <p className="text-sm text-red-400">{errors.receiver.message}</p>}
        </div>
        <div>
          <label htmlFor="phone">전화번호</label>
          <Input {...register("phone")} maxLength={11} className="bg-white" />
          {errors.phone && <p className="text-sm text-red-400">{errors.phone.message}</p>}
        </div>
        <div>
          <label>주소</label>
          <div className="flex justify-between items-center gap-2 mb-2">
            <Controller
              name="baseAddress"
              control={control}
              render={({ field }) => <Input {...field} className="bg-white" placeholder="기본 주소" disabled />}
            />
            <AddressSearchDialog onCompleteSearch={onCompleteSearch} />
          </div>
          <Input {...register("detailAddress")} className="bg-white" placeholder="상세 주소" />
          {errors.baseAddress && <p className="text-sm text-red-400">{errors.baseAddress.message}</p>}
        </div>
        <div>
          <label htmlFor="deliveryRequest">배송 요청사항</label>
          <Textarea {...register("deliveryRequest")} className="bg-white h-28 overflow-auto" />
        </div>
      </div>

      <Button type="submit" className="cursor-pointer self-end mt-4 w-20" disabled={isPending}>
        {isPending ? <Spinner /> : "제출하기"}
      </Button>
    </form>
  );
}
