import type { Route } from "+/api.campaign.raffleTicketsExport";
import { redirect } from "react-router";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { environmentVariables } from "~/main/config/environmentVariables";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const { raffleId } = adaptedRoute.params;
  const { search, status, customer_reference } = adaptedRoute.query;

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  if (customer_reference) params.set("customer_reference", customer_reference);

  const query = params.toString();
  const response = await fetch(
    `${environmentVariables.API_URL_DONATION}/api/reports/raffles/${raffleId}${query ? `?${query}` : ""}`,
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
        'attachment; filename="bilhetes-sorteio.xlsx"',
    },
  });
}
