import type { Route } from "+/route.campaign.donors";
import { redirect } from "react-router";
import { DonorsPage } from "~/client/pages/donors";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { disableRecurrence } from "../factories/disableRecurrence/disableRecurrenceFactory";
import { enableRecurrence } from "../factories/enableRecurrence/enableRecurrenceFactory";
import { listOneTimeDonors } from "../factories/listOneTimeDonors/listOneTimeDonorsFactory";
import { listRecurringDonors } from "../factories/listRecurringDonors/listRecurringDonorsFactory";
import { generatePaymentBooklet } from "../factories/generatePaymentBooklet/generatePaymentBookletFactory";
import { generateUpcomingPayments } from "../factories/generateUpcomingPayments/generateUpcomingPaymentsFactory";
import { getDonorsSummary } from "../factories/getDonorsSummary/getDonorsSummaryFactory";
import { updateRecurrence } from "../factories/updateRecurrence/updateRecurrenceFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const tab = adaptedRoute.query.tab ?? "recorrentes";

  const [summary, donors, oneTimeDonors] = await Promise.all([
    getDonorsSummary.handle(adaptedRoute),
    listRecurringDonors.handle(adaptedRoute),
    tab === "pontuais" ? listOneTimeDonors.handle(adaptedRoute) : null,
  ]);

  return { summary, donors, oneTimeDonors };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const { _action } = await DecodeRequestBodyAdapter.decode(
    adaptedRoute.request.clone(),
  );

  try {
    switch (_action) {
      case "updateRecurrence":
        await updateRecurrence.handle(adaptedRoute);
        return {
          toast: {
            message: "Recorrência atualizada com sucesso!",
            type: "success" as const,
          },
        };

      case "generateUpcomingPayments":
        await generateUpcomingPayments.handle(adaptedRoute);
        return {
          toast: {
            message: "Pagamentos gerados com sucesso!",
            type: "success" as const,
          },
        };

      case "generatePaymentBooklet": {
        const urlResponse = await generatePaymentBooklet.handle(adaptedRoute);
        return {
          urlResponse,
          toast: {
            message: "Carnê gerado com sucesso!",
            type: "success" as const,
          },
        };
      }

      case "disableRecurrence":
        await disableRecurrence.handle(adaptedRoute);
        return {
          toast: {
            message: "Recorrência cancelada com sucesso!",
            type: "success" as const,
          },
        };

      case "enableRecurrence":
        await enableRecurrence.handle(adaptedRoute);
        return {
          toast: {
            message: "Recorrência ativada com sucesso!",
            type: "success" as const,
          },
        };

      default:
        throw HttpAdapter.badRequest(`Ação desconhecida: ${_action}`);
    }
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function DonorsRoute() {
  return <DonorsPage />;
}
