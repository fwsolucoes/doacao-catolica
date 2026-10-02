import type { Route } from "+/route.donations";
import { redirect } from "react-router";
import { DonationsPage } from "~/client/pages/paymentStatements";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { allDonationsMock } from "~/lib/mocks/allDonationsMock";
import { listPaymentsByAccount } from "../factories/paymentsByAccount/listPaymentsByAccountFactory";
import { getTotalPaymentsByAccount } from "../factories/totalPaymentsByAccount/getTotalPaymentsByAccountFactory";
import { listCampaignSelect } from "../factories/campaignSelect/listCampaignSelectFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const customerRef = adaptedRoute.query.customer_reference;

  const [metrics, payments, campaigns] = await Promise.all([
    getTotalPaymentsByAccount.handle(
      user.accountId,
      undefined,
      undefined,
      adaptedRoute.query.date_type,
    ),
    listPaymentsByAccount.handle(user.accountId, adaptedRoute.query),
    listCampaignSelect.handle(adaptedRoute),
  ]);

  const donors =
    customerRef && payments.data.length > 0
      ? {
          ...allDonationsMock.donors,
          data: [
            {
              id: customerRef,
              name: payments.data[0].customerName,
              contactId: "",
              email: null,
              cpf: null,
              birthDate: null,
              phone: null,
              whatsapp: null,
              donorType: "",
              createdAt: "",
            },
            ...allDonationsMock.donors.data,
          ],
        }
      : allDonationsMock.donors;

  return { ...allDonationsMock, metrics, payments, campaigns, donors };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function AllDonationsRoute() {
  return <DonationsPage />;
}
