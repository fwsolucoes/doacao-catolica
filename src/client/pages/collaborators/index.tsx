import { Send, Users } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import { ActiveCollaboratorsTable } from "./components/activeCollaboratorsTable";
import { CancelInviteModal } from "./components/cancelInviteModal";
import { ChangeRoleModal } from "./components/changeRoleModal";
import { CollaboratorsHeader } from "./components/header";
import { PendingCollaboratorsTable } from "./components/pendingCollaboratorsTable";
import { RemoveAccessModal } from "./components/removeAccessModal";
import { ResendInviteModal } from "./components/resendInviteModal";
import type {
  ActiveCollaborator,
  CollaboratorRole,
  PendingCollaborator,
} from "./components/types";
import { formatStatus, getInitials, getRoleTone } from "./components/utils";

type DialogState =
  | { type: "changeRole"; collaborator: ActiveCollaborator }
  | { type: "removeAccess"; collaborator: ActiveCollaborator }
  | { type: "cancelInvite"; invite: PendingCollaborator }
  | { type: "resendInvite"; invite: PendingCollaborator }
  | null;

function CollaboratorsPage() {
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
      role: rolesById.get(invite.invitedUserRoleId) ?? {
        id: invite.invitedUserRoleId,
        name: "Função não encontrada",
        description: "Esta função não está disponível na lista de funções.",
        tone: "navy" as const,
      },
      status: formatStatus(invite.inviteStatus),
      invitedAt: invite.createdAt,
    }));

  const isActiveTab = tab === "active";

  return (
    <div className="flex flex-col gap-6">
      <CollaboratorsHeader />

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
          {isActiveTab ? (
            <ActiveCollaboratorsTable
              collaborators={activeCollaborators}
              onChangeRole={(collaborator) =>
                setDialog({ type: "changeRole", collaborator })
              }
              onRemoveAccess={(collaborator) =>
                setDialog({ type: "removeAccess", collaborator })
              }
            />
          ) : (
            <PendingCollaboratorsTable
              invites={pendingCollaborators}
              onCancelInvite={(invite) =>
                setDialog({ type: "cancelInvite", invite })
              }
              onResendInvite={(invite) =>
                setDialog({ type: "resendInvite", invite })
              }
            />
          )}
        </Card.Root>
      </div>

      <ChangeRoleModal
        collaborator={
          dialog?.type === "changeRole" ? dialog.collaborator : null
        }
        onClose={() => setDialog(null)}
      />
      <RemoveAccessModal
        collaborator={
          dialog?.type === "removeAccess" ? dialog.collaborator : null
        }
        onClose={() => setDialog(null)}
      />
      <CancelInviteModal
        invite={dialog?.type === "cancelInvite" ? dialog.invite : null}
        onClose={() => setDialog(null)}
      />
      <ResendInviteModal
        invite={dialog?.type === "resendInvite" ? dialog.invite : null}
        onClose={() => setDialog(null)}
      />
    </div>
  );
}

export { CollaboratorsPage };
