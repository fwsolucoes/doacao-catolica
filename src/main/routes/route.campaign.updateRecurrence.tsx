import type { Route } from "+/route.campaign.updateRecurrence";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { updateRecurrence } from "../factories/updateRecurrence/updateRecurrenceFactory";

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  try {
    await updateRecurrence.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }

  return {
    toast: {
      message: "Recorrência atualizada com sucesso!",
      type: "success" as const,
    },
  };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}
