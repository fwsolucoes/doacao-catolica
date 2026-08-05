import type { Route } from "+/route.campaign.createRecurrence";
import { redirect } from "react-router";
import { CreateRecurrencePage } from "~/client/pages/createRecurrence";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { listContacts } from "../factories/contacts/listContactsFactory";
import { findOneContact } from "../factories/contacts/findOneContactFactory";
import { createRecurrence } from "../factories/createRecurrence/createRecurrenceFactory";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const contactPublicId = adaptedRoute.query.contactPublicId;

  const [contacts, campaign, contactDetail] = await Promise.all([
    listContacts.handle(adaptedRoute),
    getCampaign.handle(adaptedRoute),
    contactPublicId
      ? findOneContact.handle(adaptedRoute)
      : Promise.resolve(null),
  ]);

  return { contacts, campaign, contactDetail, currentUrl: args.request.url };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  try {
    await createRecurrence.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }

  return {
    toast: {
      message: "Recorrência criada com sucesso!",
      type: "success" as const,
    },
  };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CreateRecurrenceRoute() {
  return <CreateRecurrencePage />;
}
