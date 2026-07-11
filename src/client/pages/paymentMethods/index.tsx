import { useState } from "react";
import {
  ArrowLeft,
  MoreHorizontal,
  PencilLine,
  Plus,
  Trash2,
} from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Empty } from "~/client/components/ui/empty";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/client/components/ui/popover";
import { Table } from "~/client/components/ui/table";
import { CreateDialog } from "./components/createDialog";
import { UpdateDialog } from "./components/updateDialog";
import { DeleteDialog } from "./components/deleteDialog";
import type { loader } from "~/main/routes/route.campaign.paymentMethods";

type PaymentMethod = { id: string; name: string };

type ActionsPopoverProps = {
  onEdit: () => void;
  onDelete: () => void;
};

function ActionsPopover({ onEdit, onDelete }: ActionsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground"
        >
          <MoreHorizontal size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1.5" align="end" sideOffset={4}>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
          onClick={onEdit}
        >
          <PencilLine size={16} />
          Editar
        </Button>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-destructive hover:bg-muted hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 size={16} />
          Excluir
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function PaymentMethodsPage() {
  const { paymentMethods } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PaymentMethod | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Métodos de pagamento
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os métodos de pagamento offline aceitos pela campanha.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Voltar
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} />
            Adicionar método
          </Button>
        </div>
      </div>

      <Card.Root className="gap-4 p-6">
        {paymentMethods.length === 0 ? (
          <Empty.Root className="border-0 py-8">
            <Empty.Header>
              <Empty.Title>Nenhum método cadastrado</Empty.Title>
              <Empty.Description>
                Adicione métodos de pagamento para que doadores possam realizar
                contribuições.
              </Empty.Description>
            </Empty.Header>
          </Empty.Root>
        ) : (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Nome</Table.Head>
                <Table.Head className="w-14 text-right">Ações</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paymentMethods.map((pm) => (
                <Table.Row key={pm.id}>
                  <Table.Cell>{pm.name}</Table.Cell>
                  <Table.Cell className="text-right">
                    <ActionsPopover
                      onEdit={() => setEditTarget(pm)}
                      onDelete={() => setDeleteTarget(pm)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Card.Root>

      <CreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <UpdateDialog
        paymentMethod={editTarget}
        onClose={() => setEditTarget(null)}
      />
      <DeleteDialog
        paymentMethod={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export { PaymentMethodsPage };
