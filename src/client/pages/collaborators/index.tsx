import { Send, Users } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
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
              {activeCount}
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
              {pendingCount}
            </span>
          </Button>
        </div>

        <Card.Root className="gap-4 p-6">
          {isActiveTab ? <ActiveCollaboratorsTable /> : <PendingCollaboratorsTable />}
        </Card.Root>
      </div>
    </div>
  );
}

export { CollaboratorsPage };
