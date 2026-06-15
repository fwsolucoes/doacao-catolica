import type { Route } from "+/route.campaign.createRecurrence";
import { redirect } from "react-router";
import { CreateRecurrencePage } from "~/client/pages/createRecurrence";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { listContacts } from "../factories/contacts/listContactsFactory";
import { createRecurrence } from "../factories/createRecurrence/createRecurrenceFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [contacts, campaign] = await Promise.all([
    listContacts.handle(adaptedRoute),
    getCampaign.handle(adaptedRoute),
  ]);

  return { contacts, campaign };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  await createRecurrence.handle(adaptedRoute);

  const { campaignId } = adaptedRoute.params;
  throw redirect(`/campaign/${campaignId}/payment-statements`);
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CreateRecurrenceRoute() {
  return <CreateRecurrencePage />;
}
