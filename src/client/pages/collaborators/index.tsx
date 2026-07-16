import { useState } from "react";
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

const ROLES: CollaboratorRole[] = [
  {
    id: "relationship",
    name: "Gestor de Relacionamento com Doadores",
    description:
      "Gerencia doadores e doações, envia mensagens e acompanha métricas da campanha. Não acessa configurações avançadas, integrações ou dados financeiros sensíveis.",
    tone: "emerald",
  },
  {
    id: "financial",
    name: "Gestor Financeiro",
    description:
      "Acompanha relatórios financeiros, solicita saques, concilia pagamentos e exporta demonstrativos. Não altera configurações da campanha nem gerencia usuários.",
    tone: "navy",
  },
  {
    id: "supervisor",
    name: "Supervisor",
    description:
      "Acesso completo às campanhas, doadores e doações, exceto configurações gerais, notificações, integrações e usuários.",
    tone: "violet",
  },
];

const ACTIVE_COLLABORATORS: ActiveCollaborator[] = [
  {
    id: "1",
    initials: "MA",
    name: "Maria Almeida",
    email: "maria@doacaocatolica.org",
    role: ROLES[2],
  },
  {
    id: "2",
    initials: "RT",
    name: "Rafael Torres",
    email: "rafael@doacaocatolica.org",
    role: ROLES[0],
  },
  {
    id: "3",
    initials: "CR",
    name: "Camila Rocha",
    email: "camila@doacaocatolica.org",
    role: ROLES[1],
  },
  {
    id: "4",
    initials: "DF",
    name: "Diego Fernandes",
    email: "diego@doacaocatolica.org",
    role: ROLES[0],
  },
];

const PENDING_COLLABORATORS: PendingCollaborator[] = [
  {
    id: "5",
    initials: "NC",
    email: "novo.colaborador@parceiro.org",
    role: ROLES[0],
    invitedAt: "há 2 dias",
  },
  {
    id: "6",
    initials: "FP",
    email: "financeiro@parceiro.org",
    role: ROLES[1],
    invitedAt: "há 5 dias",
  },
];

function CollaboratorsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(ROLES[0].id);
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

  return (
    <div className="flex flex-col gap-6">
      <CollaboratorsHeader onAddCollaborator={() => setAddOpen(true)} />
      <CollaboratorsTable
        activeCollaborators={ACTIVE_COLLABORATORS}
        pendingCollaborators={PENDING_COLLABORATORS}
        onChangeRole={handleChangeRole}
        onRemoveAccess={setRemoveCollaborator}
        onCancelInvite={setCancelInvite}
      />

      <AddCollaboratorModal
        open={addOpen}
        roles={ROLES}
        selectedRoleId={selectedRoleId}
        onOpenChange={setAddOpen}
        onSelectedRoleChange={setSelectedRoleId}
      />
      <ChangeRoleModal
        collaborator={changeRoleCollaborator}
        roles={ROLES}
        selectedRoleId={selectedRoleId}
        onClose={() => setChangeRoleCollaborator(null)}
        onSelectedRoleChange={setSelectedRoleId}
      />
      <AccessActionModal
        open={!!removeCollaborator}
        title="Remover acesso"
        description={`Remover o acesso de ${removeCollaborator?.name ?? "este colaborador"} à campanha?`}
        actionLabel="Remover acesso"
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
