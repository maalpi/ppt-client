import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam"; // Importa a webcam

interface WebcamDialogProps {
  onCapture: (image: File | null) => void;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
}

// Função para converter base64 para um objeto File
function base64ToFile(base64String: string, filename: string): File {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export function WebcamDialog({ onCapture }: WebcamDialogProps) {
  const webcamRef = useRef<Webcam>(null); // Referência para a webcam

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      if (imageSrc) {
        const imageFile = base64ToFile(imageSrc, 'captured-image.jpg'); // Converte a string Base64 em File
        onCapture(imageFile); // Envia o arquivo de imagem para o componente pai
      }
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Tirar Foto</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-3xl justify-center'>Tirar foto</AlertDialogTitle>
          <AlertDialogDescription className='flex items-center flex-col'>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={1280}
              height={720 }
              videoConstraints={videoConstraints}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={captureImage}>Capturar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
