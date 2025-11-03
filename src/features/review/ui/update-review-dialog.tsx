"use client";

import { useState } from "react";

import { Pencil } from "lucide-react";
import ReviewForm from "./review-form";
import { Review } from "@/types/review";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";

interface UpdateButtonProps {
  review: Review;
}

export default function UpdateReviewDialog({ review }: UpdateButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>리뷰 수정하기</DialogTitle>
        </DialogHeader>
        <ReviewForm mode="update" defaultData={review} onComplete={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
