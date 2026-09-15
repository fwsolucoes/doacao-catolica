import { CalendarDays, Users, UserRound } from "lucide-react";
import { useFetcher } from "react-router";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { useActionToast } from "~/client/hooks/useActionToast";
import type { PendingInvite } from "./types";

type InviteCardProps = {
  invite: PendingInvite;
  userEmail: string;
  onDecline: (invite: PendingInvite) => void;
};

function InviteCard({ invite, userEmail, onDecline }: InviteCardProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  useActionToast(fetcher.data);

  return (
    <Card.Root className="w-full max-w-155 overflow-hidden rounded-lg p-0">
      {invite.projectImage && (
        <img
          src={invite.projectImage}
          alt={invite.projectName}
          className="h-36 w-full object-cover"
        />
      )}

      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-6 text-foreground">
            Você foi convidado(a) para ser colaborador(a) desta campanha
          </p>
          <Badge variant="info" className="shrink-0">
            <Users size={11} data-icon="inline-start" />
            Colaborador
          </Badge>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Nome da campanha</p>
            <p className="mt-1 font-semibold text-(--text-heading)">
              {invite.projectName}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-2.5">
              <UserRound
                size={18}
                className="mt-0.5 shrink-0 text-muted-foreground"
              />
              <div>
                <p className="text-xs text-muted-foreground">Convidado por</p>
                <p className="mt-1 text-sm text-foreground">
                  {invite.inviterName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CalendarDays
                size={18}
                className="mt-0.5 shrink-0 text-muted-foreground"
              />
              <div>
                <p className="text-xs text-muted-foreground">Data do envio</p>
                <p className="mt-1 text-sm text-foreground">
                  {invite.inviteDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto flex gap-3 max-[420px]:flex-col">
          <fetcher.Form method="post" className="flex-1">
            <input type="hidden" name="userEmail" value={userEmail} />
            <input
              type="hidden"
              name="projectId"
              value={invite.publicProjectId}
            />
            <input
              type="hidden"
              name="roleId"
              value={invite.invitedUserRoleId}
            />
            <Button
              type="submit"
              name="_action"
              value="acceptInvitation"
              className="w-full"
              isLoading={isSubmitting}
            >
              Aceitar convite
            </Button>
          </fetcher.Form>

          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={isSubmitting}
            onClick={() => onDecline(invite)}
          >
            Recusar convite
          </Button>
        </div>
      </div>
    </Card.Root>
  );
}

export { InviteCard };
