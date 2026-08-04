import { CollaboratorsHeader } from "./components/header";
import { CollaboratorsTable } from "./components/collaboratorsTable";

function CollaboratorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <CollaboratorsHeader />
      <CollaboratorsTable />
    </div>
  );
}

export { CollaboratorsPage };
