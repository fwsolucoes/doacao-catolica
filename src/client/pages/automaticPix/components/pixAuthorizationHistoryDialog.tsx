import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/client/components/ui/dialog";
import { Table } from "~/client/components/ui/table";

type PixAuthorizationHistoryDialogProps = {
  customerName: string | null;
  subscriptionUuid: string | null;
  onClose: () => void;
};

function PixAuthorizationHistoryDialog({
  customerName,
  subscriptionUuid,
  onClose,
}: PixAuthorizationHistoryDialogProps) {
  return (
    <Dialog open={!!subscriptionUuid} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Histórico de tentativas</DialogTitle>
          {customerName && subscriptionUuid && (
            <DialogDescription>
              {customerName} · {subscriptionUuid}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="overflow-hidden rounded-xl border border-border">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Data</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Nome</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Empty />
              </Table.Body>
            </Table.Root>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { PixAuthorizationHistoryDialog };
