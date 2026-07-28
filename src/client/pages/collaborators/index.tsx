import { useState } from "react";
import { useLoaderData } from "react-router";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import { AddCollaboratorModal } from "./components/addCollaboratorModal";
import { AccessActionModal } from "./components/accessActionModal";
import { ChangeRoleModal } from "./components/changeRoleModal";
import { CollaboratorsHeader } from "./components/header";
import { CollaboratorsTable } from "./components/collaboratorsTable";
import type {
  ActiveCollaborator,
  CollaboratorRole,
  PendingCollaborator,
} from "./components/types";

const ROLE_TONES: CollaboratorRole["tone"][] = [
  "emerald",
  "navy",
  "violet",
  "amber",
];

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
  if (normalized === "rejected" || normalized === "revoked") {
    return "Recusado";
  }
  if (normalized === "cancelled") return "Cancelado";

  return status;
}

function formatInvitedAt(createdAt: string) {
  const inviteDate = new Date(createdAt);
  if (Number.isNaN(inviteDate.getTime())) return "-";

  const elapsedTime = Date.now() - inviteDate.getTime();
  const elapsedDays = Math.max(
    0,
    Math.floor(elapsedTime / (1000 * 60 * 60 * 24)),
  );

  if (elapsedDays === 0) return "hoje";
  if (elapsedDays === 1) return "há 1 dia";

  return `há ${elapsedDays} dias`;
}

function getRoleTone(name: string, index: number): CollaboratorRole["tone"] {
  const normalizedName = name.trim().toLowerCase();

  if (normalizedName.includes("administrador")) return "rose";
  if (normalizedName.includes("supervisor")) return "violet";
  if (normalizedName.includes("finance")) return "navy";
  if (normalizedName.includes("relacionamento")) return "emerald";

  return ROLE_TONES[index % ROLE_TONES.length];
}

function CollaboratorsPage() {
  const { collaborators, inviteCollaborators, projectRoles } =
    useLoaderData<CollaboratorsLoader>();
  const roles: CollaboratorRole[] = projectRoles.map((role, index) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    tone: getRoleTone(role.name, index),
  }));
  const rolesById = new Map(roles.map((role) => [role.id, role]));
  const [addOpen, setAddOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id ?? "");
  const [changeRoleCollaborator, setChangeRoleCollaborator] =
    useState<ActiveCollaborator | null>(null);
  const [removeCollaborator, setRemoveCollaborator] =
    useState<ActiveCollaborator | null>(null);
  const [cancelInvite, setCancelInvite] = useState<PendingCollaborator | null>(
    null,
  );

  function handleChangeRole(collaborator: ActiveCollaborator) {
    setSelectedRoleId(collaborator.role.id);
    setChangeRoleCollaborator(collaborator);
  }

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
        tone: "navy",
      },
    }),
  );

  const pendingCollaborators: PendingCollaborator[] =
    inviteCollaborators.data.map((invite) => ({
      id: invite.id,
      initials: getInitials(invite.invitedUserName, invite.invitedUserEmail),
      name: invite.invitedUserName,
      email: invite.invitedUserEmail,
      role: rolesById.get(invite.invitedUserRoleId) ?? {
        id: invite.invitedUserRoleId,
        name: "Função não encontrada",
        description: "Esta função não está disponível na lista de funções.",
        tone: "navy",
      },
      status: formatStatus(invite.inviteStatus),
      invitedAt: formatInvitedAt(invite.createdAt),
    }));

  return (
    <div className="flex flex-col gap-6">
      <CollaboratorsHeader onAddCollaborator={() => setAddOpen(true)} />
      <CollaboratorsTable
        activeCollaborators={activeCollaborators}
        pendingCollaborators={pendingCollaborators}
        onChangeRole={handleChangeRole}
        onRemoveAccess={setRemoveCollaborator}
        onCancelInvite={setCancelInvite}
      />

      <AddCollaboratorModal
        open={addOpen}
        roles={roles}
        selectedRoleId={selectedRoleId}
        onOpenChange={setAddOpen}
        onSelectedRoleChange={setSelectedRoleId}
      />
      <ChangeRoleModal
        collaborator={changeRoleCollaborator}
        roles={roles}
        selectedRoleId={selectedRoleId}
        onClose={() => setChangeRoleCollaborator(null)}
        onSelectedRoleChange={setSelectedRoleId}
      />
      <AccessActionModal
        open={!!removeCollaborator}
        title="Remover acesso"
        description={`Remover o acesso de ${removeCollaborator?.name ?? "este colaborador"} à campanha?`}
        actionLabel="Remover acesso"
        actionName="deleteInviteCollaborator"
        resourceId={removeCollaborator?.id}
        onClose={() => setRemoveCollaborator(null)}
      />
      <AccessActionModal
        open={!!cancelInvite}
        title="Cancelar convite"
        description={`Cancelar o convite enviado para ${cancelInvite?.email ?? "este e-mail"}?`}
        actionLabel="Cancelar convite"
        onClose={() => setCancelInvite(null)}
      />
    </div>
  );
}

export { CollaboratorsPage };
