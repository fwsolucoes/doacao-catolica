import { Plus } from "lucide-react";
import { Button } from "~/client/components/ui/button";

type CollaboratorsHeaderProps = {
  onAddCollaborator: () => void;
};

function CollaboratorsHeader({ onAddCollaborator }: CollaboratorsHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Colaboradores
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie quem tem acesso a esta campanha e suas funções.
        </p>
      </div>

      <Button className="gap-2" onClick={onAddCollaborator}>
        <Plus size={16} />
        Adicionar colaborador
      </Button>
    </div>
  );
}

export { CollaboratorsHeader };
