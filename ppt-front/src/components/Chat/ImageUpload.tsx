import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  onImageSelect: (image: File | null) => void; // Aceita File ou null
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file); // Envia o próprio arquivo
    }
  };

  return (
    <Input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
    />
  );
}
