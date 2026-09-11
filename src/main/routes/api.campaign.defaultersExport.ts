import type { Route } from "+/api.campaign.defaultersExport";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { environmentVariables } from "~/main/config/environmentVariables";
import { getCampaign } from "../factories/campaign/getCampaignFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const campaign = await getCampaign.handle(adaptedRoute);
  const accountUuid = String(campaign.apiDonationPublicId ?? campaign.id);
  const months = adaptedRoute.query.months ?? "4";

  const params = new URLSearchParams();
  params.set("account_uuid", accountUuid);
  params.set("months", months);

  const response = await fetch(
    `${environmentVariables.API_URL_WEBWORKER}/donation/defaulting-donors/export?${params}`,
    { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
  );

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ??
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ??
        'attachment; filename="inadimplentes.xlsx"',
    },
  });
}
