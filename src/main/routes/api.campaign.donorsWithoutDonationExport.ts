import type { Route } from "+/api.campaign.donorsWithoutDonationExport";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { environmentVariables } from "~/main/config/environmentVariables";
import { RegistrationsWithoutDonationsSearchParams } from "~/app/search/registrationsWithoutDonationsSearchParams";
import { getCampaign } from "../factories/campaign/getCampaignFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const { period, start_date, end_date, type, search } = adaptedRoute.query;

  const campaign = await getCampaign.handle(adaptedRoute);
  const accountUuid = String(campaign.apiDonationPublicId ?? campaign.id);

  const searchParams = new RegistrationsWithoutDonationsSearchParams({
    filter: { account_uuid: accountUuid, period, start_date, end_date, type, search },
  });

  const response = await fetch(
    `${environmentVariables.API_URL_WEBWORKER}/donation/registrations-without-donations/export${searchParams.toExternal(
      ["page", "pageLimit"],
    )}`,
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
        'attachment; filename="doadores-sem-contribuicao.xlsx"',
    },
  });
}
