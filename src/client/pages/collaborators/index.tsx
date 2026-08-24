import { Send, Users } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import { TabBar } from "~/client/components/ui/tab-button";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import { ActiveCollaboratorsTable } from "./components/activeCollaboratorsTable";
import { CollaboratorsHeader } from "./components/header";
import { PendingCollaboratorsTable } from "./components/pendingCollaboratorsTable";

function CollaboratorsPage() {
  const { collaborators, inviteCollaborators } =
    useLoaderData<CollaboratorsLoader>();
  const [tab, setTab] = useState<"active" | "pending">("active");

  const activeCount = collaborators.data.length;
  const pendingCount = inviteCollaborators.data.filter(
    (invite) => invite.inviteStatus.trim().toLowerCase() !== "accepted",
  ).length;

  const isActiveTab = tab === "active";

  return (
    <div className="flex flex-col gap-6">
      <CollaboratorsHeader />

      <div className="flex flex-col gap-4">
        <TabBar.List>
          <TabBar.Button
            active={isActiveTab}
            onClick={() => setTab("active")}
            icon={Users}
            label="Ativos"
            count={activeCount}
          />
          <TabBar.Button
            active={!isActiveTab}
            onClick={() => setTab("pending")}
            icon={Send}
            label="Pendentes"
            count={pendingCount}
          />
        </TabBar.List>

        <Card.Root className="gap-4 p-6">
          {isActiveTab ? <ActiveCollaboratorsTable /> : <PendingCollaboratorsTable />}
        </Card.Root>
      </div>
    </div>
  );
}

export { CollaboratorsPage };
