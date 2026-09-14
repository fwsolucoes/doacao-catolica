import { CalendarDays } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import type { PendingInvitesLoader } from "~/client/types/pendingInvitesLoader";
import { AmbassadorInviteCard } from "./components/ambassadorInviteCard";
import { DeclineInviteModal } from "./components/declineInviteModal";
import { EmptyPendingInvites } from "./components/emptyPendingInvites";
import { InviteCard } from "./components/inviteCard";
import type { PendingInvite } from "./components/types";

function PendingInvitesPage() {
  const { pendingInvites, pendingAmbassadorInvites, userEmail } =
    useLoaderData<PendingInvitesLoader>();
  const [declineInvite, setDeclineInvite] =
    useState<PendingInvite | null>(null);
  const closeDeclineModal = useCallback(() => setDeclineInvite(null), []);
  const hasPendingInvites =
    pendingInvites.items.length > 0 || pendingAmbassadorInvites.items.length > 0;

  return (
    <>
      {hasPendingInvites ? (
        <div className="mx-auto my-8 flex w-full max-w-334 flex-col gap-6 px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-(--text-heading)">
              Convites pendentes
            </h1>

            <Button asChild variant="outline">
              <Link to="/my-campaigns?skipPendingInvites=true">
                <CalendarDays size={16} />
                Ver todas as campanhas
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 justify-items-center gap-5 lg:grid-cols-2">
            {pendingInvites.items.map((invite) => (
              <InviteCard
                key={invite.id}
                invite={invite}
                userEmail={userEmail}
                onDecline={setDeclineInvite}
              />
            ))}
            {pendingAmbassadorInvites.items.map((invite) => (
              <AmbassadorInviteCard key={invite.id} invite={invite} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyPendingInvites />
      )}

      <DeclineInviteModal
        invite={declineInvite}
        onClose={closeDeclineModal}
      />
    </>
  );
}

export { PendingInvitesPage };
