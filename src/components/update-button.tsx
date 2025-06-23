import { Pencil } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface UpdateButtonProps {
  title: string;
  children: React.ReactNode;
}

export default function UpdateButton({ title, children }: UpdateButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
