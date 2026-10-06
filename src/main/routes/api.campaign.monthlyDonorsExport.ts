import type { Route } from "+/api.campaign.monthlyDonorsExport";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { environmentVariables } from "~/main/config/environmentVariables";
import { getCampaign } from "../factories/campaign/getCampaignFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const campaign = await getCampaign.handle(adaptedRoute);
  const projectId = String(campaign.apiDonationPublicId ?? campaign.id);

  const {
    start_month,
    end_month,
    project_account_id,
    search,
    name,
    cpf,
  } = adaptedRoute.query;

  const params = new URLSearchParams();
  params.set("project_id", projectId);
  if (start_month) params.set("start_month", start_month);
  if (end_month) params.set("end_month", end_month);
  if (project_account_id) params.set("project_account_id", project_account_id);
  if (search) params.set("search", search);
  if (name) params.set("name", name);
  if (cpf) params.set("cpf", cpf);

  const response = await fetch(
    `${environmentVariables.API_URL_WEBWORKER}/donation/monthly-donors/export?${params}`,
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
        'attachment; filename="doacoes-mes-a-mes.xlsx"',
    },
  });
}
