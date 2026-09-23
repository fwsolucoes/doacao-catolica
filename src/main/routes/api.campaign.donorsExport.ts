import type { Route } from "+/api.campaign.donorsExport";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { environmentVariables } from "~/main/config/environmentVariables";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const { campaignId } = adaptedRoute.params;
  const { search, registered_start, registered_end, payment_method, status, pay_day, is_recurring } = adaptedRoute.query;

  const filterParams = new URLSearchParams();
  if (search) filterParams.set("search", search);
  if (registered_start) filterParams.set("registered_start", registered_start);
  if (registered_end) filterParams.set("registered_end", registered_end);
  if (payment_method) filterParams.set("payment_method", payment_method);
  if (status) filterParams.set("status", status);
  if (pay_day) filterParams.set("pay_day", pay_day);
  if (is_recurring) filterParams.set("is_recurring", is_recurring);

  const filterQuery = filterParams.toString();
  const metabaseUrl = `${environmentVariables.METABASE_API}/api/card/160/query/xlsx${filterQuery ? `?${filterQuery}` : ""}`;

  const headers = new Headers();
  headers.set("Content-Type", "application/x-www-form-urlencoded");
  headers.set("x-api-key", environmentVariables.METABASE_API_KEY);
  headers.set("Cookie", environmentVariables.METABASE_COOKIE);

  const body = new URLSearchParams();
  body.set(
    "parameters",
    JSON.stringify([
      {
        type: "text",
        target: ["variable", ["template-tag", "project_id"]],
        value: campaignId,
      },
    ]),
  );
  body.set("format-rows", "true");
  body.set("pivot-results", "false");

  const response = await fetch(metabaseUrl, { method: "POST", headers, body, redirect: "follow" });

  if (!response.ok) {
    throw new Error("Failed to fetch the file");
  }

  const fileBuffer = await response.arrayBuffer();

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/vnd.ms-excel",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ??
        'attachment; filename="donors.xlsx"',
    },
  });
}
