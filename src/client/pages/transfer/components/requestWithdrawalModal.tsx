import { AlertTriangle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/client/components/ui/button";
import { CurrencyInput } from "~/client/components/ui/currency-input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/client/components/ui/dialog";
import {
  FormErrorProvider,
  FormField,
} from "~/client/components/ui/form-field";
import { Select } from "~/client/components/ui/select";
import { useActionToast } from "~/client/hooks/useActionToast";
import {
  formatCurrency,
  getPixLabel,
  getTodayISO,
  type TransferAccount,
} from "./utils";

type RequestWithdrawalModalProps = {
  accounts: TransferAccount[];
  availableAmount: number;
};

function RequestWithdrawalModal({
  accounts,
  availableAmount,
}: RequestWithdrawalModalProps) {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const isSubmitting = fetcher.state !== "idle";

  useActionToast(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) {
      setOpen(false);
      setSelectedAccountId("");
    }
  }, [fetcher.state, fetcher.data]);

  const selectedAccount = accounts.find(
    (account) => account.id === selectedAccountId,
  );

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setSelectedAccountId("");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Solicitar saque
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 sm:max-w-120">
        <DialogHeader className="flex-row items-center justify-between gap-3 px-6 py-5">
          <DialogTitle className="text-base">
            Solicitação de transferência
          </DialogTitle>
        </DialogHeader>

        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex flex-col gap-5 px-6 pb-6">
            <input type="hidden" name="_action" value="requestWithdrawal" />
            <input
              type="hidden"
              name="pix_key"
              value={selectedAccount?.pixKey ?? ""}
            />
            <input
              type="hidden"
              name="pix_type"
              value={selectedAccount?.pixType ?? ""}
            />
            <input type="hidden" name="schedule_date" value={getTodayISO()} />

            <div className="flex gap-3 rounded-xl border border-[rgba(var(--spotlight-warning),0.35)] bg-[rgba(var(--spotlight-warning),0.09)] p-4">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-[#7A4A15E5]"
              />
              <div className="flex flex-col gap-1">
                <strong className="text-sm text-[#7A4A15E5]">Atenção!</strong>
                <p className="text-sm leading-6 text-[#7A4A15E5]">
                  A chave Pix para transferência deve ter a mesma titularidade
                  do CNPJ/CPF da carteira digital utilizada nesta campanha. Por
                  motivo de segurança, não será possível transferência para
                  terceiros. A transferência será processada em até 1 dia útil.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <FormField
                  name="account_uuid"
                  label="Selecione a chave Pix"
                  required
                >
                  <Select.Root
                    name="account_uuid"
                    value={selectedAccountId}
                    onValueChange={setSelectedAccountId}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Escolha uma chave cadastrada" />
                    </Select.Trigger>
                    <Select.Content
                      position="popper"
                      align="start"
                      sideOffset={4}
                    >
                      {accounts.map((account) => (
                        <Select.Item key={account.id} value={account.id}>
                          {getPixLabel(account)}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </FormField>
                <p className="text-xs text-muted-foreground">
                  Para adicionar uma conta de repasse,{" "}
                  <span className="font-medium text-primary">clique aqui.</span>
                </p>
              </div>

              <FormField name="amount" label="Valor" required>
                <div className="-mt-6 mb-1 self-end text-xs text-muted-foreground">
                  Saldo disponível:{" "}
                  <span className="font-semibold text-foreground">
                    {formatCurrency(availableAmount)}
                  </span>
                </div>
                <CurrencyInput disabled={!accounts.length} />
              </FormField>
            </div>

            <DialogFooter className="px-0 pb-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Fechar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting || !accounts.length || !selectedAccount}
                isLoading={isSubmitting}
              >
                Solicitar
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { RequestWithdrawalModal };
