import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";

type AccessActionModalProps = {
  open: boolean;
  title: string;
  description: string;
  actionLabel: string;
  onClose: () => void;
};

function AccessActionModal({
  open,
  title,
  description,
  actionLabel,
  onClose,
}: AccessActionModalProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <DialogClose asChild>
            <Button type="button" variant="danger" disabled>
              {actionLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AccessActionModal };
