import {
  MoreHorizontal,
  Pencil,
  Send,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";
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
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import { AccessActionModal } from "./accessActionModal";
import { ChangeRoleModal } from "./changeRoleModal";
import type { ActiveCollaborator, CollaboratorRole, PendingCollaborator } from "./types";

const STATUS_BADGE: Record<string, { className: string; label: string }> = {
  Pendente: { className: "bg-amber-100 text-amber-700", label: "Pendente" },
  Aceito: { className: "bg-emerald-100 text-emerald-700", label: "Aceito" },
  Recusado: { className: "bg-red-100 text-red-700", label: "Recusado" },
  cancelled: { className: "bg-red-100 text-red-700", label: "Recusado" },
  revoked: { className: "bg-zinc-100 text-zinc-600", label: "Acesso removido" },
};

const ROLE_TONES: CollaboratorRole["tone"][] = ["emerald", "navy", "violet"];

type DialogState =
  | { type: "changeRole"; collaborator: ActiveCollaborator }
  | { type: "removeAccess"; collaborator: ActiveCollaborator }
  | { type: "cancelInvite"; invite: PendingCollaborator }
  | null;

function getInitials(name: string, email: string) {
  const base = name.trim() || email.split("@")[0] || email;
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatStatus(status: string) {
  const normalized = status.trim().toLowerCase();
  if (normalized === "pending") return "Pendente";
  if (normalized === "accepted") return "Aceito";
  if (normalized === "rejected") return "Recusado";
  return status;
}

function getRoleTone(name: string, index: number): CollaboratorRole["tone"] {
  const normalizedName = name.trim().toLowerCase();
  if (normalizedName.includes("supervisor")) return "violet";
  if (normalizedName.includes("finance")) return "navy";
  if (normalizedName.includes("relacionamento")) return "emerald";
  return ROLE_TONES[index % ROLE_TONES.length];
}

function CollaboratorsTable() {
  const { collaborators, inviteCollaborators, projectRoles } =
    useLoaderData<CollaboratorsLoader>();
  const [tab, setTab] = useState<"active" | "pending">("active");
  const [dialog, setDialog] = useState<DialogState>(null);

  const roles: CollaboratorRole[] = projectRoles.map((role, index) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    tone: getRoleTone(role.name, index),
  }));
  const rolesById = new Map(roles.map((role) => [role.id, role]));

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

  const pendingCollaborators: PendingCollaborator[] = inviteCollaborators.data
    .filter((invite) => invite.inviteStatus.trim().toLowerCase() !== "accepted")
    .map((invite) => ({
      id: invite.id,
      initials: getInitials(invite.invitedUserName, invite.invitedUserEmail),
      name: invite.invitedUserName,
      email: invite.invitedUserEmail,
      status: formatStatus(invite.inviteStatus),
    }));

  const isActiveTab = tab === "active";
  const rows = isActiveTab ? activeCollaborators : pendingCollaborators;

  return (
    <>
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
                              setDialog({ type: "changeRole", collaborator: row as ActiveCollaborator })
                            }
                          >
                            <Pencil size={16} />
                            Alterar função
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() =>
                              setDialog({ type: "removeAccess", collaborator: row as ActiveCollaborator })
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
                              setDialog({ type: "cancelInvite", invite: row as PendingCollaborator })
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

      <ChangeRoleModal
        collaborator={dialog?.type === "changeRole" ? dialog.collaborator : null}
        onClose={() => setDialog(null)}
      />
      <AccessActionModal
        open={dialog?.type === "removeAccess"}
        title="Remover acesso"
        description={`Remover o acesso de ${dialog?.type === "removeAccess" ? dialog.collaborator.name : "este colaborador"} à campanha?`}
        actionLabel="Remover acesso"
        actionName="deleteInviteCollaborator"
        resourceId={dialog?.type === "removeAccess" ? dialog.collaborator.id : undefined}
        onClose={() => setDialog(null)}
      />
      <AccessActionModal
        open={dialog?.type === "cancelInvite"}
        title="Cancelar convite"
        description={`Cancelar o convite enviado para ${dialog?.type === "cancelInvite" ? dialog.invite.email : "este e-mail"}?`}
        actionLabel="Cancelar convite"
        onClose={() => setDialog(null)}
      />
    </>
  );
}

export { CollaboratorsTable };
