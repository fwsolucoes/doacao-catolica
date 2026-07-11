import type { Route } from "+/route.campaign.createOneTimePayment";
import { redirect } from "react-router";
import { CreateOneTimePaymentPage } from "~/client/pages/createOneTimePayment";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { listContacts } from "../factories/contacts/listContactsFactory";
import { findOneContact } from "../factories/contacts/findOneContactFactory";
import { createOneTimePayment } from "../factories/createOneTimePayment/createOneTimePaymentFactory";
import { paymentMethodFactory } from "../factories/paymentMethod/paymentMethodFactory";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const contactPublicId = adaptedRoute.query.contactPublicId;

  const [contacts, campaign, contactDetail, { paymentMethods }] = await Promise.all([
    listContacts.handle(adaptedRoute),
    getCampaign.handle(adaptedRoute),
    contactPublicId
      ? findOneContact.handle(adaptedRoute)
      : Promise.resolve(null),
    paymentMethodFactory.handleLoader(adaptedRoute),
  ]);

  return { contacts, campaign, contactDetail, paymentMethods };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  try {
    await createOneTimePayment.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }

  return {
    toast: {
      message: "Pagamento avulso criado com sucesso!",
      type: "success" as const,
    },
  };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CreateOneTimePaymentRoute() {
  return <CreateOneTimePaymentPage />;
}
