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

      <Card.Root className="gap-0 rounded-2xl p-0">
        <Table.Root>
          <Table.Header className="bg-transparent">
            <Table.Row>
              <Table.Head>{isActiveTab ? "Nome" : "E-mail"}</Table.Head>
              {isActiveTab && <Table.Head>E-mail</Table.Head>}
              <Table.Head>Função</Table.Head>
              {!isActiveTab && <Table.Head>Convidado</Table.Head>}
              <Table.Head className="text-right">Ações</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body className="before:hidden [&>tr]:h-14 [&>tr:nth-child(odd)]:bg-transparent [&>tr]:border-b [&>tr]:border-border">
            {rows.map((row) =>
              isActiveTab ? (
                <Table.Row key={row.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
                          {(row as ActiveCollaborator).initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {(row as ActiveCollaborator).name}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {(row as ActiveCollaborator).email}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={(row as ActiveCollaborator).role.tone}>
                      {(row as ActiveCollaborator).role.name}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal size={16} />
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
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                          {(row as PendingCollaborator).initials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{(row as PendingCollaborator).email}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={(row as PendingCollaborator).role.tone}>
                      {(row as PendingCollaborator).role.name}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {(row as PendingCollaborator).invitedAt}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal size={16} />
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
          </Table.Body>
        </Table.Root>

        <Card.Footer className="justify-between px-5 pb-4 text-sm text-muted-foreground">
          <span>Total de {rows.length} registros</span>
          <div className="flex items-center gap-3">
            <span>Página 1 de 1</span>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="size-8" disabled>
                ‹
              </Button>
              <Button variant="outline" size="icon" className="size-8" disabled>
                ›
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}

export { CollaboratorsTable };
