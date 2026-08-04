import { useState } from "react";
import { AddCollaboratorModal } from "./components/addCollaboratorModal";
import { CollaboratorsHeader } from "./components/header";
import { CollaboratorsTable } from "./components/collaboratorsTable";

function CollaboratorsPage() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <CollaboratorsHeader onAddCollaborator={() => setAddOpen(true)} />
      <CollaboratorsTable />

      <AddCollaboratorModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </div>
  );
}

export { CollaboratorsPage };
