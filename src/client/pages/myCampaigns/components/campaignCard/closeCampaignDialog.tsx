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
import { useActionToast } from "~/client/hooks/useActionToast";

type CloseCampaignDialogProps = {
  campaign: { id: string; name: string };
  open: boolean;
  onClose: () => void;
};

function CloseCampaignDialog({ campaign, open, onClose }: CloseCampaignDialogProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  useActionToast(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Encerrar campanha</DialogTitle>
          <DialogDescription>
            A campanha <strong>{campaign.name}</strong> será encerrada hoje e
            deixará de receber doações. Deseja continuar?
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form method="post" action="/my-campaigns">
          <input type="hidden" name="campaignId" value={campaign.id} />
          <DialogFooter showCloseButton>
            <Button
              type="submit"
              name="_action"
              value="closeCampaign"
              variant="danger"
              isLoading={isSubmitting}
            >
              Encerrar
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { CloseCampaignDialog };
