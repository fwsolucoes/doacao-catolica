import { Lock } from "lucide-react";
import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { FormErrorProvider, FormField } from "~/client/components/ui/form-field";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { Switch } from "~/client/components/ui/switch";
import { useActionToast } from "~/client/hooks/useActionToast";
import type { RaffleItem } from "../types";

type RaffleFormDialogProps = {
  open: boolean;
  /** null → criação; preenchido → edição */
  raffle: RaffleItem | null;
  onClose: () => void;
};

function RaffleFormDialog({ open, raffle, onClose }: RaffleFormDialogProps) {
  const fetcher = useFetcher();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";

  const isEditing = !!raffle;
  // Após a primeira venda a API trava valor do bilhete e número inicial,
  // e o número final só pode ser ampliado.
  const isLocked = !!raffle?.hasSales;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast?.type === "success") {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="gap-5">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar sorteio" : "Novo sorteio"}</DialogTitle>
          <DialogDescription className="text-base">
            Defina o período, o valor e a faixa de números dos bilhetes.
          </DialogDescription>
        </DialogHeader>

        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form
            method="post"
            key={raffle?.id ?? "new"}
            className="flex flex-col gap-5"
          >
            {raffle && <input type="hidden" name="id" value={raffle.id} />}

            <div className="flex flex-col gap-5 px-6">
              <FormField name="name" label="Nome do sorteio" required>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex.: Sorteio de Natal"
                  defaultValue={raffle?.name ?? ""}
                  autoFocus
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField name="startDate" label="Data inicial" required>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    defaultValue={raffle?.startDateInput ?? ""}
                  />
                </FormField>
                <FormField name="endDate" label="Data final" required>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    defaultValue={raffle?.endDateInput ?? ""}
                  />
                </FormField>
              </div>

              <FormField
                name="ticketPrice"
                label="Valor do bilhete (R$)"
                required={!isLocked}
              >
                {isLocked ? (
                  // sem `name`: campo travado não é enviado à API
                  <Input
                    id="ticketPrice"
                    value={raffle?.ticketPriceLabel ?? ""}
                    disabled
                    readOnly
                  />
                ) : (
                  <CurrencyInput
                    placeholder="10,00"
                    defaultValue={raffle?.ticketPrice}
                  />
                )}
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="startNumber"
                  label="Número inicial"
                  required={!isLocked}
                >
                  <Input
                    id="startNumber"
                    name={isLocked ? undefined : "startNumber"}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    placeholder="1"
                    defaultValue={raffle?.startNumber ?? 1}
                    disabled={isLocked}
                  />
                </FormField>
                <FormField name="endNumber" label="Número final" required>
                  <Input
                    id="endNumber"
                    name="endNumber"
                    type="number"
                    inputMode="numeric"
                    min={isLocked ? raffle?.endNumber : 0}
                    step={1}
                    placeholder="1000"
                    defaultValue={raffle?.endNumber ?? ""}
                  />
                </FormField>
              </div>

              {isLocked && (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Lock size={14} className="mt-0.5 shrink-0" />
                  Este sorteio já tem bilhetes emitidos: o valor do bilhete e o
                  número inicial não podem mais ser alterados, e o número final
                  só pode ser ampliado.
                </p>
              )}

              <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
                <div className="flex flex-col">
                  <Label htmlFor="enabled" className="text-base">
                    Sorteio ativo
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    Bilhetes disponíveis para venda.
                  </span>
                </div>
                <Switch
                  id="enabled"
                  name="enabled"
                  value="true"
                  defaultChecked={raffle?.enabled ?? true}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                name="_action"
                value={isEditing ? "updateRaffle" : "createRaffle"}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Salvando..."
                  : isEditing
                    ? "Salvar alterações"
                    : "Criar sorteio"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { RaffleFormDialog };
