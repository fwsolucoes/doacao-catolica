import type { Route } from "+/api.campaign.ambassadorsExport";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { environmentVariables } from "~/main/config/environmentVariables";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const { campaignId } = adaptedRoute.params;
  const { start_date, end_date, search, min_indications, max_indications } = adaptedRoute.query;

  const params = new URLSearchParams({ project_id: campaignId });
  if (start_date) params.set("start_date", start_date);
  if (end_date) params.set("end_date", end_date);
  if (search) params.set("search", search);
  if (min_indications) params.set("min_indications", min_indications);
  if (max_indications) params.set("max_indications", max_indications);

  const response = await fetch(
    `${environmentVariables.API_URL_WEBWORKER}/donation/ambassadors/export?${params}`,
    { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
  );

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="ambassadors.csv"',
    },
  });
}
