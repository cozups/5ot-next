'use client';

import { deleteCategory } from '@/actions/category';
import { Button } from './ui/button';

export default function DeleteButton({ id }: { id: string }) {
  const onClickDelete = async (id: string) => {
    await deleteCategory(id);
  };

  return (
    <Button variant="destructive" onClick={onClickDelete.bind(null, id)}>
      삭제
    </Button>
  );
}
