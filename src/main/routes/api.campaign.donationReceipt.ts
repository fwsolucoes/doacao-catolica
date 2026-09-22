import type { Route } from "+/api.campaign.donationReceipt";
import { redirect } from "react-router";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { environmentVariables } from "~/main/config/environmentVariables";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const { campaignId } = adaptedRoute.params;
  const { paymentId } = adaptedRoute.query;

  if (!campaignId) throw new Error("campaignId is required");
  if (!paymentId) throw new Error("paymentId is required");

  const response = await fetch(
    `${environmentVariables.API_URL_WEBWORKER}/donation-payment-receipt`,
    {
      method: "POST",
      headers: {
        "api-key": environmentVariables.API_KEY_DONATION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payment_id: paymentId, project_id: campaignId }),
    },
  );

  if (!response.ok) throw new Error("Failed to fetch receipt");

  const data = await response.json();
  if (!data.url) throw new Error("URL not found in response");

  return redirect(data.url);
}
