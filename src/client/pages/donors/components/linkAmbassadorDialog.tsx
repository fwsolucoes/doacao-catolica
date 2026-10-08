import { useEffect, useRef, useState } from "react";
import { useFetcher, useParams } from "react-router";
import type { AmbassadorsLoader } from "~/client/types/ambassadorsLoader";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Combobox } from "~/client/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import {
  FormErrorProvider,
  FormField,
} from "~/client/components/ui/form-field";
import { Separator } from "~/client/components/ui/separator";
import { useActionToast } from "~/client/hooks/useActionToast";
import { formatCurrency } from "~/lib/formatCurrency";
import { getInitials } from "~/lib/getInitials";
import type { DonorRow } from "./donorsTable";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  automatic_pix: "Pix Automático",
  pix: "Pix",
  bank_slip: "Boleto",
  credit_card: "Cartão de Crédito",
};

type LinkAmbassadorDialogProps = {
  donor: DonorRow | null;
  onClose: () => void;
};

function LinkAmbassadorDialog({ donor, onClose }: LinkAmbassadorDialogProps) {
  const { campaignId } = useParams<{ campaignId: string }>();
  const fetcher = useFetcher();
  const ambassadorsFetcher = useFetcher<AmbassadorsLoader>();
  useActionToast(fetcher.data);
  const isSubmitting = fetcher.state !== "idle";
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedAmbassadorId, setSelectedAmbassadorId] = useState("");

  useEffect(() => {
    if (!donor) return;
    setSelectedAmbassadorId("");
    ambassadorsFetcher.load(`/campaign/${campaignId}/fundraisers`);
  }, [donor?.subscriptionUuid]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast?.type === "success") {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  function handleSearchChange(search: string) {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("ambassadors:search", search);
      ambassadorsFetcher.load(
        `/campaign/${campaignId}/fundraisers?${params.toString()}`,
      );
    }, 500);
  }

  const ambassadorOptions = (
    ambassadorsFetcher.data?.activeFundraisers.data ?? []
  ).map((fundraiser) => ({
    value: fundraiser.id,
    label: `${fundraiser.invitedUserName} (${fundraiser.invitedUserEmail})`,
  }));

  return (
    <Dialog open={!!donor} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular embaixador</DialogTitle>
        </DialogHeader>
        <FormErrorProvider fieldErrors={fetcher.data?.cause?.fieldErrors}>
          <fetcher.Form method="post" className="flex flex-col gap-4">
            <input
              type="hidden"
              name="subscriptionUuid"
              value={donor?.subscriptionUuid ?? ""}
            />
            <input
              type="hidden"
              name="affiliateReference"
              value={selectedAmbassadorId}
            />
            <div className="flex flex-col gap-4 px-6">
              <FormField
                name="affiliateReference"
                label="Selecione o embaixador:"
                required
              >
                <Combobox
                  options={ambassadorOptions}
                  value={selectedAmbassadorId}
                  onChange={setSelectedAmbassadorId}
                  onSearchChange={handleSearchChange}
                  placeholder="Selecione um embaixador"
                  searchPlaceholder="Pesquisar por nome..."
                  emptyText="Nenhum embaixador encontrado."
                />
              </FormField>

              {donor && (
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                        {getInitials(donor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {donor.name}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {donor.cpf ?? "—"}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-sm divide-x divide-border">
                    <div className="pr-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        E-mail
                      </p>
                      <p className="text-foreground">{donor.email ?? "—"}</p>
                    </div>
                    <div className="px-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        Telefone
                      </p>
                      <p className="text-foreground">{donor.phone ?? "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-border pt-3 text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {formatCurrency(String(donor.amount))}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        todo dia {donor.payDay}
                      </span>
                    </div>
                    <Badge variant="neutral">
                      {PAYMENT_METHOD_LABEL[donor.paymentMethod] ??
                        donor.paymentMethod}
                    </Badge>
                    <Badge variant={donor.status ? "success" : "danger"}>
                      {donor.status ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            <Separator />
            <DialogFooter showCloseButton>
              <Button
                type="submit"
                name="_action"
                value="linkAmbassador"
                disabled={isSubmitting || !selectedAmbassadorId}
              >
                {isSubmitting ? "Vinculando..." : "Vincular embaixador"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </FormErrorProvider>
      </DialogContent>
    </Dialog>
  );
}

export { LinkAmbassadorDialog };
