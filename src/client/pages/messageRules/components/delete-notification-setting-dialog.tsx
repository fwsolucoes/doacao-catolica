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
import { TrashDashedBorderCircle } from "~/client/components/ui/trash-dashed-border-circle";
import { useActionToast } from "~/client/hooks/useActionToast";
import type { MessageRulesLoader } from "~/client/types/messageRulesLoader";

type NotificationSettingJson = MessageRulesLoader["notificationSettings"][number];

type Props = {
  rule: NotificationSettingJson | null;
  onClose: () => void;
};

function DeleteNotificationSettingDialog({ rule, onClose }: Props) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  useActionToast(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.toast?.type === "success") {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Dialog open={!!rule} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover configuração</DialogTitle>
        </DialogHeader>

        <fetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="uuid" value={rule?.uuid ?? ""} />

          <TrashDashedBorderCircle />
          <DialogDescription className="px-6 text-center">
            Deseja remover <strong>{rule?.name}</strong>? Esta ação não pode
            ser desfeita.
          </DialogDescription>

          <Separator />
          <DialogFooter showCloseButton>
            <Button
              type="submit"
              name="_action"
              value="deleteNotificationSetting"
              variant="danger"
              isLoading={isSubmitting}
            >
              Remover
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteNotificationSettingDialog };
