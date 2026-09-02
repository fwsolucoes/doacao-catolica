import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { Separator } from "~/client/components/ui/separator";
import { useActionToast } from "~/client/hooks/useActionToast";
import type { WhatsappTemplateDetailButton } from "~/domain/views/whatsappTemplateDetail";
import { BUTTON_TYPES } from "./ButtonCard";

type DeleteButtonModalProps = {
  button: WhatsappTemplateDetailButton | null;
  onClose: () => void;
};

function DeleteButtonModal({ button, onClose }: DeleteButtonModalProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  useActionToast(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  const displayName = button ? (BUTTON_TYPES[button.subType]?.label ?? button.subType) : "";

  return (
    <Dialog open={!!button} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir botão</DialogTitle>
        </DialogHeader>

        <fetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="button_uuid" value={button?.uuid ?? ""} />

          <div className="flex items-center justify-center">
            <div className="flex size-30 items-center justify-center rounded-full border border-dashed border-border bg-muted p-3.75">
              <div className="flex size-22.5 items-center justify-center rounded-full bg-destructive">
                <Trash2 className="size-10 text-white" />
              </div>
            </div>
          </div>

          <DialogDescription className="px-6 text-center">
            Tem certeza que deseja excluir o botão <strong>{displayName}</strong>? Esta ação não
            pode ser desfeita.
          </DialogDescription>

          <Separator />

          <DialogFooter showCloseButton closeButtonLabel="Fechar">
            <Button
              type="submit"
              name="_action"
              value="delete_button"
              variant="danger"
              isLoading={isSubmitting}
            >
              Excluir botão
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteButtonModal };
