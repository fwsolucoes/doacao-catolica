import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Table } from "~/client/components/ui/table";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import { ChangeRoleModal } from "./changeRoleModal";
import { RemoveAccessModal } from "./removeAccessModal";
import type { ActiveCollaborator } from "./types";
import { buildRolesById, getInitials } from "./utils";

function ActiveCollaboratorsTable() {
  const { collaborators, projectRoles } = useLoaderData<CollaboratorsLoader>();
  const [changeRoleTarget, setChangeRoleTarget] =
    useState<ActiveCollaborator | null>(null);
  const [removeAccessTarget, setRemoveAccessTarget] =
    useState<ActiveCollaborator | null>(null);

  const rolesById = buildRolesById(projectRoles);

  const activeCollaborators: ActiveCollaborator[] = collaborators.data.map(
    (collaborator) => ({
      id: collaborator.id,
      initials: getInitials(collaborator.user.name, collaborator.user.email),
      name: collaborator.user.name,
      email: collaborator.user.email,
      role: rolesById.get(collaborator.roleId) ?? {
        id: collaborator.roleId,
        name: "Função não encontrada",
        description: "Esta função não está disponível na lista de funções.",
        tone: "navy" as const,
      },
    }),
  );

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Nome</Table.Head>
            <Table.Head>E-mail</Table.Head>
            <Table.Head>Função</Table.Head>
            <Table.Head className="text-right">Ações</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {activeCollaborators.map((collaborator) => (
            <Table.Row key={collaborator.id}>
              <Table.Cell>
                <div className="flex items-center gap-3.5">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                      {collaborator.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground">
                    {collaborator.name}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell className="font-mono text-xs text-muted-foreground">
                {collaborator.email}
              </Table.Cell>
              <Table.Cell>
                <Badge className="py-3" variant={collaborator.role.tone}>
                  {collaborator.role.name}
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
                      onSelect={() => setChangeRoleTarget(collaborator)}
                    >
                      <Pencil size={16} />
                      Alterar função
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => setRemoveAccessTarget(collaborator)}
                    >
                      <Trash2 size={16} />
                      Remover acesso
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Table.Cell>
            </Table.Row>
          ))}
          {!activeCollaborators.length && (
            <Table.Empty title="Nenhum colaborador ativo encontrado." />
          )}
        </Table.Body>
      </Table.Root>

      <ChangeRoleModal
        collaborator={changeRoleTarget}
        onClose={() => setChangeRoleTarget(null)}
      />
      <RemoveAccessModal
        collaborator={removeAccessTarget}
        onClose={() => setRemoveAccessTarget(null)}
      />
    </>
  );
}

export { ActiveCollaboratorsTable };
