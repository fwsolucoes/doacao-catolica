import { Send, Users } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import { cn } from "~/lib/utils";
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
        <div className="flex w-fit items-center gap-1 rounded-[13px] border border-border bg-muted/60 p-1.5">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 rounded-xl",
              isActiveTab
                ? "bg-[#e6e6ed] text-foreground hover:bg-[#e6e6ed] hover:text-foreground"
                : "text-muted-foreground hover:bg-transparent hover:text-muted-foreground",
            )}
            onClick={() => setTab("active")}
          >
            <Users size={15} />
            Ativos
            <span className="rounded-full bg-muted-foreground/15 px-2 text-xs">
              {activeCount}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 rounded-xl",
              !isActiveTab
                ? "bg-[#e6e6ed] text-foreground hover:bg-[#e6e6ed] hover:text-foreground"
                : "text-muted-foreground hover:bg-transparent hover:text-muted-foreground",
            )}
            onClick={() => setTab("pending")}
          >
            <Send size={15} />
            Pendentes
            <span className="rounded-full bg-muted-foreground/15 px-2 text-xs">
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
