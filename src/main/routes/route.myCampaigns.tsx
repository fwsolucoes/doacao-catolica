import type { Route } from "+/route.myCampaigns";
import { MyCampaignsPage } from "~/client/pages/myCampaigns";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { listCampaigns } from "../factories/campaign/listCampaignsFactory";
import { getCampaignById } from "../factories/campaign/getCampaignByIdFactory";
import { getPortalOverview } from "../factories/campaignOverview/getPortalOverviewFactory";
import { listPendingInvites } from "../factories/pendingInvite/listPendingInvitesFactory";
import { listPendingAmbassadorInvites } from "../factories/pendingAmbassadorInvite/listPendingAmbassadorInvitesFactory";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { redirect } from "react-router";

type CampaignMetrics = {
  donorsCount: number;
  raised: number;
  goal: number | null;
  goalProgressPercentage: number | null;
};

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const campaigns = await listCampaigns.handle(adaptedRoute);

  // overview.monthlyGoal/totalGoal nao sao confiaveis (ficam null mesmo quando
  // a campanha tem meta configurada) - as metas vem da API principal (find-one)
  const [overviewResults, campaignDetailResults] = await Promise.all([
    Promise.allSettled(
      campaigns.data.map((campaign) => getPortalOverview.handle(campaign.id)),
    ),
    Promise.allSettled(
      campaigns.data.map((campaign) =>
        getCampaignById.handle(campaign.id, user.token),
      ),
    ),
  ]);

  const overviewByCampaignId = new Map<
    string,
    Awaited<ReturnType<typeof getPortalOverview.handle>>
  >();
  overviewResults.forEach((result, index) => {
    if (result.status !== "fulfilled") return;
    overviewByCampaignId.set(campaigns.data[index].id, result.value);
  });

  const campaignDetailById = new Map<
    string,
    Awaited<ReturnType<typeof getCampaignById.handle>>
  >();
  campaignDetailResults.forEach((result, index) => {
    if (result.status !== "fulfilled") return;
    campaignDetailById.set(campaigns.data[index].id, result.value);
  });

  const metricsByCampaignId = new Map<string, CampaignMetrics>();
  for (const campaign of campaigns.data) {
    const overview = overviewByCampaignId.get(campaign.id);
    if (!overview) continue;

    const detail = campaignDetailById.get(campaign.id);
    const goal = detail?.monthlyGoal || detail?.totalGoal || null;
    const raised = overview.totalRaised;
    const goalProgressPercentage =
      goal && goal > 0 ? Math.min(100, (raised / goal) * 100) : null;

    metricsByCampaignId.set(campaign.id, {
      donorsCount: overview.supporters,
      raised,
      goal,
      goalProgressPercentage,
    });
  }

  const enrichedCampaigns = {
    ...campaigns,
    data: campaigns.data.map((campaign) => {
      const metrics = metricsByCampaignId.get(campaign.id);
      return {
        ...campaign,
        donorsCount: metrics?.donorsCount ?? null,
        raised: metrics?.raised ?? null,
        goal: metrics?.goal ?? null,
        goalProgressPercentage: metrics?.goalProgressPercentage ?? null,
      };
    }),
  };

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

  return { campaigns: enrichedCampaigns };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function TestPage() {
  return <MyCampaignsPage />;
}
