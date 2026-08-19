import type { Route } from "+/route.campaign.automaticPix";
import { redirect } from "react-router";
import { AutomaticPixPage } from "~/client/pages/automaticPix";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getPixAuthorizationSummary } from "../factories/pixAuthorizationSummary/getPixAuthorizationSummaryFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const summary = await getPixAuthorizationSummary.handle(adaptedRoute);

  return { summary };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function AutomaticPixRoute() {
  return <AutomaticPixPage />;
}
