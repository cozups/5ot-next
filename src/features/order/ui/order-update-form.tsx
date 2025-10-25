"use client";

import { Address } from "react-daum-postcode";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Order } from "@/types/orders";
import { Button, Input, Spinner, Textarea } from "@/components/ui";
import AddressSearchDialog from "./address-search-dialog";
import { OrderFormData, orderFormSchema } from "@/lib/validations-schema/order";
import { useTransition } from "react";
import { updateOrderData } from "../actions";
import { toast } from "sonner";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { useUser } from "@/hooks/use-users";
import { generateFormData } from "@/lib/generate-form-data";

interface OrderUpdateFromProps {
  defaultData: Order;
  onComplete: () => void;
}

export default function OrderUpdateForm({ defaultData, onComplete }: OrderUpdateFromProps) {
  const [isPending, startTransition] = useTransition();
  const [baseAddress, detailAddress] = defaultData.address.split(", ");
  const { user } = useUser();
  const isAdmin = user?.user_metadata.role === "admin";
  const { invalidateCache } = useInvalidateCache(["orders", isAdmin ? "admin" : "user"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      receiver: defaultData.receiver,
      phone: defaultData.phone,
      baseAddress,
      detailAddress,
    },
  });

  const onSubmit: SubmitHandler<OrderFormData> = (data) => {
    const formData = generateFormData(data);

    startTransition(async () => {
      const result = await updateOrderData(defaultData.id, formData);

      if (result.success) {
        toast.success("주문이 업데이트 되었습니다.");
        invalidateCache();
        onComplete();
      }
      if (result.errors?.name === "server") {
        toast.success("주문 업데이트 중 문제가 발생하였습니다.", { description: result.errors.message });
      }
    });
  };

  const onCompleteSearch = (data: Address) => {
    const { address: searchedAddress } = data;
    setValue("baseAddress", searchedAddress);
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
        {isPending ? <Spinner /> : "수정하기"}
      </Button>
    </form>
  );
}
