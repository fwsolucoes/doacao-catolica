import type { Route } from "+/api.monthlyDonorsExport";
import { redirect } from "react-router";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { environmentVariables } from "~/main/config/environmentVariables";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const {
    account_uuid,
    start_month,
    end_month,
    project_id,
    project_account_id,
    search,
    name,
    cpf,
  } = adaptedRoute.query;

  const params = new URLSearchParams();
  if (account_uuid) params.set("account_uuid", account_uuid);
  if (start_month) params.set("start_month", start_month);
  if (end_month) params.set("end_month", end_month);
  if (project_id) params.set("project_id", project_id);
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
