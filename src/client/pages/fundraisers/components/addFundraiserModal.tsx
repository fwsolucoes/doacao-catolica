import { Send } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import { useActionToast } from "~/client/hooks/useActionToast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";

type AddFundraiserModalProps = {
  open: boolean;
  onClose: () => void;
};

function AddFundraiserModal({ open, onClose }: AddFundraiserModalProps) {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = fetcher.state !== "idle";
  useActionToast(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      formRef.current?.reset();
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 px-8 pb-5 pt-8">
          <DialogTitle className="text-xl">Adicionar arrecadador</DialogTitle>
          <p className="text-base text-muted-foreground">
            Envie um convite por e-mail para adicionar um arrecadador.
          </p>
        </DialogHeader>

        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form
            ref={formRef}
            method="post"
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-8 pb-6">
              <FormField name="userEmail" label="E-mail" required>
                <Input
                  name="userEmail"
                  type="email"
                  placeholder="arrecadador@exemplo.com"
                />
              </FormField>
            </div>

            <DialogFooter className="shrink-0 border-t border-border px-8 py-5">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                name="_action"
                value="createFundraiser"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="gap-2"
              >
                <Send size={16} />
                Enviar convite
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { AddFundraiserModal };
