import {
  MoreHorizontal,
  Pencil,
  Send,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Table } from "~/client/components/ui/table";
import type { ActiveCollaborator, PendingCollaborator } from "./types";

const STATUS_BADGE: Record<string, { className: string; label: string }> = {
  Pendente: { className: "bg-amber-100 text-amber-700", label: "Pendente" },
  Aceito: { className: "bg-emerald-100 text-emerald-700", label: "Aceito" },
  Recusado: { className: "bg-red-100 text-red-700", label: "Recusado" },
  cancelled: { className: "bg-red-100 text-red-700", label: "Recusado" },
  revoked: { className: "bg-zinc-100 text-zinc-600", label: "Acesso removido" },
};

type CollaboratorsTableProps = {
  activeCollaborators: ActiveCollaborator[];
  pendingCollaborators: PendingCollaborator[];
  onChangeRole: (collaborator: ActiveCollaborator) => void;
  onRemoveAccess: (collaborator: ActiveCollaborator) => void;
  onCancelInvite: (invite: PendingCollaborator) => void;
};

function CollaboratorsTable({
  activeCollaborators,
  pendingCollaborators,
  onChangeRole,
  onRemoveAccess,
  onCancelInvite,
}: CollaboratorsTableProps) {
  const [tab, setTab] = useState<"active" | "pending">("active");
  const isActiveTab = tab === "active";
  const rows = isActiveTab ? activeCollaborators : pendingCollaborators;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit rounded-xl border border-border bg-card p-1">
        <Button
          variant={isActiveTab ? "secondary" : "ghost"}
          size="sm"
          className="gap-2 rounded-lg"
          onClick={() => setTab("active")}
        >
          <Users size={15} />
          Ativos
          <span className="rounded-full bg-muted px-2 text-xs">
            {activeCollaborators.length}
          </span>
        </Button>
        <Button
          variant={!isActiveTab ? "secondary" : "ghost"}
          size="sm"
          className="gap-2 rounded-lg"
          onClick={() => setTab("pending")}
        >
          <Send size={15} />
          Pendentes
          <span className="rounded-full bg-muted px-2 text-xs">
            {pendingCollaborators.length}
          </span>
        </Button>
      </div>

      <Card.Root className="gap-4 p-6">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>{isActiveTab ? "Nome" : "E-mail"}</Table.Head>
              {isActiveTab && <Table.Head>E-mail</Table.Head>}
              <Table.Head>Função</Table.Head>
              {!isActiveTab && <Table.Head>Convidado</Table.Head>}
              {!isActiveTab && <Table.Head>Status</Table.Head>}
              <Table.Head className="text-right">Ações</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) =>
              isActiveTab ? (
                <Table.Row key={row.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3.5">
                      <Avatar size="lg">
                        <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                          {(row as ActiveCollaborator).initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">
                        {(row as ActiveCollaborator).name}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="font-mono text-xs text-muted-foreground">
                    {(row as ActiveCollaborator).email}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      className="py-3"
                      variant={(row as ActiveCollaborator).role.tone}
                    >
                      {(row as ActiveCollaborator).role.name}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 text-muted-foreground"
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onSelect={() =>
                            onChangeRole(row as ActiveCollaborator)
                          }
                        >
                          <Pencil size={16} />
                          Alterar função
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() =>
                            onRemoveAccess(row as ActiveCollaborator)
                          }
                        >
                          <Trash2 size={16} />
                          Remover acesso
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Table.Cell>
                </Table.Row>
              ) : (
                <Table.Row key={row.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3.5">
                      <Avatar size="lg">
                        <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                          {(row as PendingCollaborator).initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate text-sm text-foreground">
                        {(row as PendingCollaborator).email}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    <span>-</span>
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    <span>-</span>
                  </Table.Cell>
                  <Table.Cell>
                    {(() => {
                      const s = STATUS_BADGE[(row as PendingCollaborator).status];
                      return (
                        <Badge
                          className={s?.className ?? "bg-muted text-muted-foreground"}
                        >
                          {s?.label ?? (row as PendingCollaborator).status}
                        </Badge>
                      );
                    })()}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 text-muted-foreground"
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <UserCheck size={16} />
                          Reenviar convite
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() =>
                            onCancelInvite(row as PendingCollaborator)
                          }
                        >
                          <Trash2 size={16} />
                          Cancelar convite
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Table.Cell>
                </Table.Row>
              ),
            )}

            {isActiveTab && !activeCollaborators.length && (
              <Table.Empty title="Nenhum colaborador ativo encontrado." />
            )}
            {!isActiveTab && !pendingCollaborators.length && (
              <Table.Empty title="Nenhum convite pendente encontrado." />
            )}
          </Table.Body>
        </Table.Root>

      </Card.Root>
    </div>
  );
}

export { CollaboratorsTable };
