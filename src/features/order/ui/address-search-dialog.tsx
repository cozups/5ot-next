"use client";

import { useState } from "react";
import DaumPostcode, { type Address } from "react-daum-postcode";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";

export default function AddressSearchDialog({ onCompleteSearch }: { onCompleteSearch: (data: Address) => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onComplete = (data: Address) => {
    onCompleteSearch(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button className="w-20" onClick={() => setIsOpen(true)}>
          주소 찾기
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>주소 찾기</DialogTitle>
          <DialogDescription>배송될 주소를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <DaumPostcode onComplete={onComplete} />
      </DialogContent>
    </Dialog>
  );
}
