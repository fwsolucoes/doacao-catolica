import type { Route } from "+/api.campaign.donorHealthExport";
import { redirect } from "react-router";
import { DonorHealthSearchParams } from "~/app/search/donorHealthSearchParams";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { donorHealthQuerySchema } from "~/infra/schemas/internal/donorHealth";
import { AuthService } from "~/infra/services/authService";
import { environmentVariables } from "~/main/config/environmentVariables";
import { getCampaign } from "../factories/campaign/getCampaignFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const campaign = await getCampaign.handle(adaptedRoute);
  const query = new SchemaValidatorAdapter(donorHealthQuerySchema).validate(
    adaptedRoute.query,
  );

  const searchParams = new DonorHealthSearchParams({
    filter: { months: query.months, lapse_months: query.lapse_months, download: 1 },
  });

  const response = await fetch(
    `${environmentVariables.API_URL_WEBWORKER}/accounts/${campaign.accountId}/reports/donor-health/pdf${searchParams.toExternal(
      ["page", "pageLimit"],
    )}`,
    { headers: { "X-Reports-Token": environmentVariables.REPORTS_API_TOKEN } },
  );

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/pdf",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ??
        'attachment; filename="saude-da-base-de-doadores.pdf"',
    },
  });
}
