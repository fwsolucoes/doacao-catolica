import type { Route } from "+/api.campaign.donorsExport";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { environmentVariables } from "~/main/config/environmentVariables";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const { campaignId } = adaptedRoute.params;

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

  const response = await fetch(
    `${environmentVariables.METABASE_API}/api/card/160/query/xlsx`,
    { method: "POST", headers, body, redirect: "follow" },
  );

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/vnd.ms-excel",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ??
        'attachment; filename="donors.xlsx"',
    },
  });
}
