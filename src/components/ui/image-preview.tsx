import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImagePreviewProps {
  src: string | undefined;
  alt: string;
  className?: string;
  sizes?: string;
}

export default function ImagePreview({ src, alt, className, sizes }: ImagePreviewProps) {
  return (
    <div className={cn("relative aspect-square bg-slate-500", className)}>
      {!src && null}
      {src && <Image src={src} fill alt={alt} className="object-cover" sizes={sizes} />}
    </div>
  );
}
