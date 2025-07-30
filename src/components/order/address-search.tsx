import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import DaumPostcode, { type Address } from "react-daum-postcode";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "../ui";
import { AddressResult } from "./order-form";

interface AddressSearchProps {
  address: AddressResult;
  setAddress: Dispatch<SetStateAction<AddressResult>>;
  defaultData?: string;
}

export default function AddressSearch({ address, setAddress, defaultData }: AddressSearchProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const [defaultBase, defaultDetail] = defaultData ? defaultData.split(", ") : ["", ""];

    setAddress({ base: defaultBase, detail: defaultDetail });
  }, [defaultData, setAddress]);

  const onCompleteSearch = (data: Address) => {
    const { address: searchedAddress } = data;

    setAddress({
      base: searchedAddress,
      detail: address.detail,
    });
    setIsOpen(false);
  };

  const onInputDetail = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, detail: e.target.value });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input value={address.base} className="bg-white" disabled />
        <Input name="base-address" defaultValue={address.base} className="hidden" />
        <Dialog open={isOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)}>주소 찾기</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>주소 찾기</DialogTitle>
              <DialogDescription>배송될 주소를 입력해주세요.</DialogDescription>
            </DialogHeader>
            <DaumPostcode onComplete={onCompleteSearch} />
          </DialogContent>
        </Dialog>
      </div>
      <Input
        type="text"
        name="detail-address"
        className="bg-white"
        placeholder="상세 주소를 입력해주세요."
        value={address.detail}
        onChange={onInputDetail}
      />
    </div>
  );
}
