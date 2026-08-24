import { Plus, Send, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import type { FundraisersLoader } from "~/client/types/fundraisersLoader";
import { cn } from "~/lib/utils";
import { AddFundraiserModal } from "./components/addFundraiserModal";
import { ActiveFundraisersTable } from "./components/activeFundraisersTable";
import { PendingFundraisersTable } from "./components/pendingFundraisersTable";

function FundraisersPage() {
  const { fundraisers } = useLoaderData<FundraisersLoader>();
  const [tab, setTab] = useState<"active" | "pending">("active");
  const [addOpen, setAddOpen] = useState(false);
  const closeAdd = useCallback(() => setAddOpen(false), []);
  const isActiveTab = tab === "active";

  const activeCount = fundraisers.data.filter(
    (f) => f.inviteStatus.trim().toLowerCase() === "accepted",
  ).length;

  const pendingCount = fundraisers.data.filter(
    (f) => f.inviteStatus.trim().toLowerCase() !== "accepted",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Embaixadores
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os embaixadores, suas comissões e as indicações de doadores.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setAddOpen(true)}>
          <Plus size={16} />
          Adicionar embaixador
        </Button>
      </div>

      <AddFundraiserModal open={addOpen} onClose={closeAdd} />

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
            Convites pendentes
            <span className="rounded-full bg-muted-foreground/15 px-2 text-xs">
              {pendingCount}
            </span>
          </Button>
        </div>

        <Card.Root className="gap-4 p-6">
          {isActiveTab ? <ActiveFundraisersTable /> : <PendingFundraisersTable />}
        </Card.Root>
      </div>
    </div>
  );
}

export { FundraisersPage };
