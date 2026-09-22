import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { TEMPLATE_TYPE_LABEL } from "./templateTypes";

type PreviewTarget = { type: string; body: string };

type PreviewLayoutDialogProps = {
  target: PreviewTarget | null;
  onClose: () => void;
};

function PreviewLayoutDialog({ target, onClose }: PreviewLayoutDialogProps) {
  const title = target ? (TEMPLATE_TYPE_LABEL[target.type] ?? target.type) : "";

  return (
    <Dialog open={target !== null} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-muted sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Prévia do layout renderizado.</DialogDescription>
        </DialogHeader>

        <div className="mx-6 mb-6 overflow-hidden rounded-xl border border-border bg-card">
          <iframe
            key={target?.type}
            srcDoc={target?.body ?? ""}
            title={title}
            className="h-130 w-full"
            sandbox="allow-same-origin"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { PreviewLayoutDialog, type PreviewTarget };
