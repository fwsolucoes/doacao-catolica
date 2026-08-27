import type { Route } from "+/api.financialSummaryExport";
import { redirect } from "react-router";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { environmentVariables } from "~/main/config/environmentVariables";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const { date_type, start_date, end_date } = adaptedRoute.query;

  const params = new URLSearchParams();
  if (date_type) params.set("date_type", date_type);
  if (start_date) params.set("start_date", start_date);
  if (end_date) params.set("end_date", end_date);

  const response = await fetch(
    `${environmentVariables.API_URL_WEBWORKER}/donation/financial-summary/${user.accountId}/export?${params}`,
    { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
  );

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="financial-summary.csv"',
    },
  });
}
