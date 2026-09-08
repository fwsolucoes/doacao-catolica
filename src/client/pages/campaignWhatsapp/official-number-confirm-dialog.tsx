import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useFetcher, useRouteLoaderData } from "react-router";
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
import type { CampaignLayoutLoader } from "~/client/types/campaignLayoutLoader";

type ConfirmData = { success: boolean };

function OfficialNumberConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const layoutData = useRouteLoaderData<CampaignLayoutLoader>(
    "main/routes/layout.campaignLayout",
  );
  const accountReference = layoutData?.campaign.id;

  const fetcher = useFetcher<ConfirmData>();
  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      onConfirm();
    }
  }, [fetcher.state, fetcher.data, onConfirm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Usar número oficial</DialogTitle>
        </DialogHeader>
        <fetcher.Form
          method="post"
          action="/api/whatsapp/selectOfficialNumber"
          className="flex flex-col gap-4"
        >
          <input
            type="hidden"
            name="accountReference"
            value={accountReference ?? ""}
          />
          <div className="flex items-center justify-center">
            <div className="flex size-30 items-center justify-center rounded-full border border-dashed border-border bg-muted p-3.75">
              <div className="flex size-22.5 items-center justify-center rounded-full bg-emerald-500">
                <MessageCircle className="size-10 text-white" />
              </div>
            </div>
          </div>
          <DialogDescription className="px-6 text-center">
            Sua campanha passará a usar o número oficial da plataforma para
            envio de mensagens pelo WhatsApp. Você pode alterar essa escolha a
            qualquer momento.
          </DialogDescription>
          <Separator />
          <DialogFooter showCloseButton closeButtonLabel="Fechar">
            <Button type="submit" disabled={isLoading} isLoading={isLoading}>
              Confirmar
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { OfficialNumberConfirmDialog };
