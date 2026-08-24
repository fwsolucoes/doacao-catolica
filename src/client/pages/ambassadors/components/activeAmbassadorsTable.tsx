import { BarChart2, LayoutDashboard, MoreHorizontal, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useLoaderData } from "react-router";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Button } from "~/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Table } from "~/client/components/ui/table";
import type { AmbassadorsLoader } from "~/client/types/ambassadorsLoader";
import type { ActiveFundraiser } from "../types";
import { AmbassadorDetailsModal } from "./ambassadorDetailsModal";
import { RemoveAccessModal } from "./removeAccessModal";

function getInitials(name: string, email: string): string {
  const base = name.trim() || email.split("@")[0] || email;
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function ActiveAmbassadorsTable() {
  const { fundraisers } = useLoaderData<AmbassadorsLoader>();
  const [removeTarget, setRemoveTarget] = useState<ActiveFundraiser | null>(
    null,
  );
  const [detailsTarget, setDetailsTarget] = useState<ActiveFundraiser | null>(
    null,
  );
  const closeRemove = useCallback(() => setRemoveTarget(null), []);
  const closeDetails = useCallback(() => setDetailsTarget(null), []);

  const activeFundraisers: ActiveFundraiser[] = fundraisers.data
    .filter((f) => f.inviteStatus.trim().toLowerCase() === "accepted")
    .map((f) => ({
      id: f.id,
      initials: getInitials(f.invitedUserName, f.invitedUserEmail),
      name: f.invitedUserName,
      email: f.invitedUserEmail,
    }));

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Nome</Table.Head>
            <Table.Head>E-mail</Table.Head>
            <Table.Head>Ações</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {activeFundraisers.map((fundraiser) => (
            <Table.Row key={fundraiser.id}>
              <Table.Cell>
                <div className="flex items-center gap-3.5">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                      {fundraiser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground">
                    {fundraiser.name}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell className="font-mono text-xs text-muted-foreground">
                {fundraiser.email}
              </Table.Cell>
              <Table.Cell className="">
                <div className="flex items-center  gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => setDetailsTarget(fundraiser)}
                  >
                    <BarChart2 size={14} />
                    Detalhes
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 text-muted-foreground"
                      >
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem
                        className="whitespace-nowrap"
                        onSelect={() =>
                          window.open(
                            `https://indique.doacaocatolica.com/${fundraiser.id}`,
                            "_blank",
                          )
                        }
                      >
                        <LayoutDashboard size={16} />
                        Ver dashboard doador
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setRemoveTarget(fundraiser)}
                      >
                        <Trash2 size={16} />
                        Remover acesso
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
          {!activeFundraisers.length && (
            <Table.Empty title="Nenhum embaixador ativo encontrado." />
          )}
        </Table.Body>
      </Table.Root>

      <RemoveAccessModal fundraiser={removeTarget} onClose={closeRemove} />
      <AmbassadorDetailsModal
        fundraiser={detailsTarget}
        onClose={closeDetails}
      />
    </>
  );
}

export { ActiveAmbassadorsTable };
