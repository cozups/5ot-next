import { useState } from "react";

export function useImagePreview(defaultImage?: string) {
  const [pickedImage, setPickedImage] = useState<string | undefined>(defaultImage || undefined);

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

  const resetImage = () => {
    setPickedImage(defaultImage || undefined);
  };

  return { pickedImage, setPickedImage, onChangeImage, resetImage };
}
