import type { Route } from "+/route.myCampaigns";
import { MyCampaignsPage } from "~/client/pages/myCampaigns";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { listCampaigns } from "../factories/campaign/listCampaignsFactory";
import { listPendingInvites } from "../factories/pendingInvite/listPendingInvitesFactory";
import { listPendingAmbassadorInvites } from "../factories/pendingAmbassadorInvite/listPendingAmbassadorInvitesFactory";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { redirect } from "react-router";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const campaigns = await listCampaigns.handle(adaptedRoute);

  const url = new URL(args.request.url);
  const skipPendingInvites =
    url.searchParams.get("skipPendingInvites") === "true";

  if (!skipPendingInvites) {
    const [pendingInvites, pendingAmbassadorInvites] = await Promise.all([
      listPendingInvites.handle(adaptedRoute),
      listPendingAmbassadorInvites.handle(adaptedRoute),
    ]);

    if (
      pendingInvites.items.length > 0 ||
      pendingAmbassadorInvites.items.length > 0
    ) {
      throw redirect("/pending-invites");
    }
  }

  return { campaigns };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function TestPage() {
  return <MyCampaignsPage />;
}
