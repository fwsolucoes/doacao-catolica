import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import type { RaffleItem } from "../types";

type DeleteRaffleDialogProps = {
  raffle: RaffleItem | null;
  onClose: () => void;
};

// TODO: integrar com DELETE /raffles/{uuid} quando a rota existir na API de doações.
// Até lá o modal é apenas visual — o botão "Excluir" fica desabilitado.
function DeleteRaffleDialog({ raffle, onClose }: DeleteRaffleDialogProps) {
  return (
    <Dialog open={!!raffle} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Excluir sorteio?</DialogTitle>
          <DialogDescription className="text-base">
            O sorteio "{raffle?.name}" será removido. Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            variant="danger"
            disabled
            title="A exclusão de sorteios ainda não está disponível."
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteRaffleDialog };
