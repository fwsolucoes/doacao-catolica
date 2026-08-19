import { useEffect } from "react";
import { useFetcher, useParams } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { Table } from "~/client/components/ui/table";
import type { PixAuthorizationHistoryJson } from "~/domain/entities/pixAuthorizationHistory";

type PixAuthorizationHistoryDialogProps = {
  customerName: string | null;
  customerCpfCnpj: string | null;
  subscriptionUuid: string | null;
  onClose: () => void;
};

function PixAuthorizationHistoryDialog({
  customerName,
  customerCpfCnpj,
  subscriptionUuid,
  onClose,
}: PixAuthorizationHistoryDialogProps) {
  const { campaignId } = useParams<{ campaignId: string }>();
  const fetcher = useFetcher<PixAuthorizationHistoryJson>();

  useEffect(() => {
    if (!subscriptionUuid || !campaignId) return;
    fetcher.load(
      `/campaign/${campaignId}/api/pix-authorization-history/${subscriptionUuid}`,
    );
  }, [subscriptionUuid, campaignId]);

  const history = fetcher.data;
  const isLoading = fetcher.state !== "idle";

  return (
    <Dialog open={!!subscriptionUuid} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Histórico de tentativas</DialogTitle>
          {customerName && subscriptionUuid && (
            <DialogDescription>
              {customerCpfCnpj
                ? `${customerName} · ${customerCpfCnpj}`
                : customerName}
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
                {isLoading && (
                  <Table.Row>
                    <Table.Cell
                      colSpan={3}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Carregando...
                    </Table.Cell>
                  </Table.Row>
                )}
                {!isLoading &&
                  history?.authorizations.map((item) => (
                    <Table.Row key={item.authorizationUuid}>
                      <Table.Cell className="text-foreground">
                        {item.statusUpdatedAt}
                      </Table.Cell>
                      <Table.Cell className="text-foreground">
                        {item.statusLabel}
                      </Table.Cell>
                      <Table.Cell className="text-muted-foreground">
                        {history.customerName}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                {!isLoading && !history?.authorizations.length && (
                  <Table.Empty />
                )}
              </Table.Body>
            </Table.Root>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { PixAuthorizationHistoryDialog };
