import type { Route } from "+/api.campaign.donationsExport";
import { getMonthDates } from "~/lib/getMonthDates";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { environmentVariables } from "~/main/config/environmentVariables";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const { campaignId } = adaptedRoute.params;
  const { start_date, end_date, per_page, date_type, origin, type, status, notified_email, notified_whatsapp, search, customer_reference } = adaptedRoute.query;

  const { lastDayOfMonth } = getMonthDates(0);

  const params = new URLSearchParams();
  params.set("start_date", start_date ?? "2022-01-01");
  params.set("end_date", end_date ?? lastDayOfMonth);
  if (per_page) params.set("per_page", per_page);
  if (date_type) params.set("date_type", date_type);
  if (origin) params.set("origin", origin);
  if (type) params.set("type", type);
  if (status) params.set("status", status);
  if (notified_email) params.set("notified_email", notified_email);
  if (notified_whatsapp) params.set("notified_whatsapp", notified_whatsapp);
  if (search) params.set("search", search);
  if (customer_reference) params.set("customer_reference", customer_reference);

  const response = await fetch(
    `${environmentVariables.API_URL_DONATION}/api/reports/subscriptions/${campaignId}?${params}`,
    { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
  );

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "text/csv; charset=utf-8",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ??
        'attachment; filename="donations.csv"',
    },
  });
}
