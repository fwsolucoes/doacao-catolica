import { CircleHelp, Plus, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { TablePagination } from "~/client/components/ui/table-pagination";
import { useFilter } from "~/client/hooks/useFilter";
import type { RafflesLoader } from "~/client/types/rafflesLoader";
import { DeleteRaffleDialog } from "./components/deleteRaffleDialog";
import { RaffleFormDialog } from "./components/raffleFormDialog";
import { RafflesTable } from "./components/rafflesTable";
import type { RaffleItem } from "./types";

type DialogState =
  | { type: "create" }
  | { type: "edit"; raffle: RaffleItem }
  | { type: "delete"; raffle: RaffleItem }
  | null;

const ALL_STATUS = "all";

function RafflesPage() {
  const { raffles } = useLoaderData<RafflesLoader>();
  const { getParam, handleChangeTimeoutFilter, handleChangeFilter } =
    useFilter("raffles");

  const [dialog, setDialog] = useState<DialogState>(null);
  // remonta o formulário a cada abertura: descarta fetcher.data (erros de campo)
  // da submissão anterior sem cortar a animação de fechamento
  const [formKey, setFormKey] = useState(0);
  const closeDialog = useCallback(() => setDialog(null), []);
  const openCreate = useCallback(() => {
    setFormKey((key) => key + 1);
    setDialog({ type: "create" });
  }, []);
  const openEdit = useCallback((raffle: RaffleItem) => {
    setFormKey((key) => key + 1);
    setDialog({ type: "edit", raffle });
  }, []);
  const openDelete = useCallback(
    (raffle: RaffleItem) => setDialog({ type: "delete", raffle }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Sorteios
          </h1>
          <p className="text-sm text-muted-foreground">
            Sorteios cadastrados nesta campanha.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="how-it-works">
              <CircleHelp size={16} />
              Como funciona
            </Link>
          </Button>
          <Button onClick={openCreate}>
            <Plus size={16} />
            Novo sorteio
          </Button>
        </div>
      </div>

      <Card.Root className="gap-6 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-144">
            <Input
              leftIcon={Search}
              placeholder="Buscar por nome do sorteio…"
              defaultValue={getParam("search") ?? ""}
              onChange={(e) =>
                handleChangeTimeoutFilter("search", e.target.value)
              }
            />
          </div>
          <div className="w-full sm:w-50">
            <Select.Root
              value={getParam("status") ?? ALL_STATUS}
              onValueChange={(value) =>
                handleChangeFilter("status", value === ALL_STATUS ? "" : value)
              }
            >
              <Select.Trigger aria-label="Filtrar por status">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value={ALL_STATUS}>Todos os status</Select.Item>
                <Select.Item value="active">Ativo</Select.Item>
                <Select.Item value="inactive">Inativo</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        <RafflesTable
          raffles={raffles.data}
          onEdit={openEdit}
          onDelete={openDelete}
        />

        {raffles.meta.totalPages > 1 && (
          <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <TablePagination
              currentPage={raffles.meta.page}
              totalPages={raffles.meta.totalPages}
              pageParam="raffles:page"
            />
          </Card.Footer>
        )}
      </Card.Root>

      <RaffleFormDialog
        key={formKey}
        open={dialog?.type === "create" || dialog?.type === "edit"}
        raffle={dialog?.type === "edit" ? dialog.raffle : null}
        onClose={closeDialog}
      />
      <DeleteRaffleDialog
        raffle={dialog?.type === "delete" ? dialog.raffle : null}
        onClose={closeDialog}
      />
    </div>
  );
}

export { RafflesPage };
