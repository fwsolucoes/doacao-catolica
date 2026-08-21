import type { Route } from "+/api.campaign.fundraiserDetails";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getFundraiserDetails } from "../factories/fundraiser/getFundraiserDetailsFactory";

export async function loader(props: Route.LoaderArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(props);
    return await getFundraiserDetails.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}
