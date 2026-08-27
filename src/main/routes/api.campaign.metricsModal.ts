import type { Route } from "+/api.campaign.metricsModal";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getCampaignMetricsModal } from "../factories/financialSummary/getCampaignMetricsModalFactory";

export async function loader(props: Route.LoaderArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(props);
    return await getCampaignMetricsModal.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}
