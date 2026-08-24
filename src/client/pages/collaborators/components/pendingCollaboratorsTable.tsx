import { MoreHorizontal, Trash2, UserCheck } from "lucide-react";
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
import { CancelInviteModal } from "./cancelInviteModal";
import { ResendInviteModal } from "./resendInviteModal";
import type { PendingCollaborator } from "./types";
import { buildRolesById, formatStatus, getInitials } from "./utils";

const STATUS_BADGE: Record<string, { variant: "warning" | "success" | "danger" | "neutral"; label: string }> = {
  Pendente: { variant: "warning", label: "Pendente" },
  Aceito: { variant: "success", label: "Aceito" },
  Recusado: { variant: "danger", label: "Recusado" },
  cancelled: { variant: "danger", label: "Recusado" },
  revoked: { variant: "neutral", label: "Acesso removido" },
};

function PendingCollaboratorsTable() {
  const { inviteCollaborators, projectRoles } =
    useLoaderData<CollaboratorsLoader>();
  const [cancelTarget, setCancelTarget] = useState<PendingCollaborator | null>(
    null,
  );
  const [resendTarget, setResendTarget] = useState<PendingCollaborator | null>(
    null,
  );

  const rolesById = buildRolesById(projectRoles);

  const pendingCollaborators: PendingCollaborator[] = inviteCollaborators.data
    .filter((invite) => invite.inviteStatus.trim().toLowerCase() !== "accepted")
    .map((invite) => ({
      id: invite.id,
      initials: getInitials(invite.invitedUserName, invite.invitedUserEmail),
      name: invite.invitedUserName,
      email: invite.invitedUserEmail,
      role: rolesById.get(invite.invitedUserRoleId) ?? {
        id: invite.invitedUserRoleId,
        name: "Função não encontrada",
        description: "Esta função não está disponível na lista de funções.",
        tone: "navy" as const,
      },
      status: formatStatus(invite.inviteStatus),
      invitedAt: invite.createdAt,
    }));

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>E-mail</Table.Head>
            {/* <Table.Head>Função</Table.Head> */}
            {/* <Table.Head>Convidado</Table.Head> */}
            <Table.Head>Status</Table.Head>
            <Table.Head className="text-right">Ações</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pendingCollaborators.map((invite) => {
            const badge = STATUS_BADGE[invite.status];
            return (
              <Table.Row key={invite.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3.5">
                    <Avatar size="lg">
                      <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                        {invite.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm text-foreground">
                      {invite.email}
                    </span>
                  </div>
                </Table.Cell>
                {/* <Table.Cell className="text-muted-foreground">
                  <span>-</span>
                </Table.Cell> */}
                {/* <Table.Cell className="text-muted-foreground">
                  <span>-</span>
                </Table.Cell> */}
                <Table.Cell>
                  <Badge variant={badge?.variant ?? "neutral"}>
                    {badge?.label ?? invite.status}
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
                      <DropdownMenuItem onSelect={() => setResendTarget(invite)}>
                        <UserCheck size={16} />
                        Reenviar convite
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setCancelTarget(invite)}
                      >
                        <Trash2 size={16} />
                        Cancelar convite
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Table.Cell>
              </Table.Row>
            );
          })}
          {!pendingCollaborators.length && (
            <Table.Empty title="Nenhum convite pendente encontrado." />
          )}
        </Table.Body>
      </Table.Root>

      <CancelInviteModal
        invite={cancelTarget}
        onClose={() => setCancelTarget(null)}
      />
      <ResendInviteModal
        invite={resendTarget}
        onClose={() => setResendTarget(null)}
      />
    </>
  );
}

export { PendingCollaboratorsTable };
