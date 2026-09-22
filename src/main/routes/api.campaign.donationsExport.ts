import type { Route } from "+/api.campaign.donationsExport";
import { getMonthDates } from "~/lib/getMonthDates";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { environmentVariables } from "~/main/config/environmentVariables";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const { campaignId } = adaptedRoute.params;
  const { start_date, end_date, date_type, origin, type, status, notified_email, notified_whatsapp, search, customer_reference } = adaptedRoute.query;

  const { lastDayOfMonth } = getMonthDates(0);

  const params = new URLSearchParams();
  params.set("start_date", start_date ?? "2022-01-01");
  params.set("end_date", end_date ?? lastDayOfMonth);
  if (date_type) params.set("date_type", date_type);
  if (origin) params.set("origin", origin);
  if (type) params.set("type", type);
  if (status) params.set("status", status);
  if (notified_email) params.set("notified_email", notified_email);
  if (notified_whatsapp) params.set("notified_whatsapp", notified_whatsapp);
  if (search) params.set("search", search);
  if (customer_reference) params.set("customer_reference", customer_reference);

  const response = await fetch(
    `${environmentVariables.API_URL_DONATION}/api/reports/payments/${campaignId}?${params}`,
    { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch the file");
  }

  const fileBuffer = await response.arrayBuffer();

  return new Response(fileBuffer, {
    status: 200,
    headers: response.headers,
  });
}
