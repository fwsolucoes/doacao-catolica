import { MoreHorizontal, Send, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useLoaderData } from "react-router";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Table } from "~/client/components/ui/table";
import type { FundraisersLoader } from "~/client/types/fundraisersLoader";
import type { PendingFundraiser } from "../types";
import { CancelInviteModal } from "./cancelInviteModal";
import { ResendInviteModal } from "./resendInviteModal";

const STATUS_BADGE: Record<string, { className: string; label: string }> = {
  Pendente: { className: "bg-amber-100 text-amber-700", label: "Pendente" },
  Recusado: { className: "bg-red-100 text-red-700", label: "Recusado" },
  cancelled: { className: "bg-red-100 text-red-700", label: "Cancelado" },
};

function getInitials(name: string, email: string): string {
  const base = name.trim() || email.split("@")[0] || email;
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatStatus(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === "pending") return "Pendente";
  if (normalized === "rejected") return "Recusado";
  return status;
}

function PendingFundraisersTable() {
  const { fundraisers } = useLoaderData<FundraisersLoader>();
  const [cancelTarget, setCancelTarget] = useState<PendingFundraiser | null>(null);
  const [resendTarget, setResendTarget] = useState<PendingFundraiser | null>(null);
  const closeCancel = useCallback(() => setCancelTarget(null), []);
  const closeResend = useCallback(() => setResendTarget(null), []);

  const pendingFundraisers: PendingFundraiser[] = fundraisers.data
    .filter((f) => f.inviteStatus.trim().toLowerCase() !== "accepted")
    .map((f) => ({
      id: f.id,
      initials: getInitials(f.invitedUserName, f.invitedUserEmail),
      name: f.invitedUserName,
      email: f.invitedUserEmail,
      status: formatStatus(f.inviteStatus),
    }));

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>E-mail</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head className="text-right">Ações</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pendingFundraisers.map((invite) => {
            const badge = STATUS_BADGE[invite.status];
            return (
              <Table.Row key={invite.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3.5">
                    <Avatar size="lg">
                      <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                        {invite.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm text-foreground">
                      {invite.email}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    className={badge?.className ?? "bg-muted text-muted-foreground"}
                  >
                    {badge?.label ?? invite.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-right">
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
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onSelect={() => setResendTarget(invite)}>
                        <Send size={16} />
                        Reenviar convite
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setCancelTarget(invite)}
                      >
                        <Trash2 size={16} />
                        Cancelar convite
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Table.Cell>
              </Table.Row>
            );
          })}
          {!pendingFundraisers.length && (
            <Table.Empty title="Nenhum convite pendente encontrado." />
          )}
        </Table.Body>
      </Table.Root>

      <CancelInviteModal invite={cancelTarget} onClose={closeCancel} />
      <ResendInviteModal invite={resendTarget} onClose={closeResend} />
    </>
  );
}

export { PendingFundraisersTable };
