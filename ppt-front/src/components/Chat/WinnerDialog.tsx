import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { useRouter } from 'next/router';

  interface VencedorDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    vencedor: string | null;
  }
  
  export function VencedorDialog({ open, setOpen, vencedor }: VencedorDialogProps) {
    const handleRedirect = () => {
      window.location.href = '/users'; // Redireciona para a página /lobby
    };
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-3xl justify-center'>Resultado da Partida</AlertDialogTitle>
            <AlertDialogDescription className='flex items-center flex-col'>
              {vencedor ? `O vencedor é: ${vencedor}` : 'Aguardando resultado...'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleRedirect}>Lobby</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  