import { Outlet, type LoaderFunctionArgs } from "react-router";

import { LogService } from "@arkyn/server";
import { RootLayout, rootLinks, rootMeta } from "./client/layouts/rootLayout";
import { RouteAdapter } from "./infra/adapters/routeAdapter";
import { AuthService } from "./infra/services/authService";
import { environmentVariables } from "./main/config/environmentVariables";

export const meta = rootMeta;
export const links = rootLinks;

export const Layout = RootLayout;

export async function loader(args: LoaderFunctionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);

  LogService.setConfig({
    trafficSourceId: environmentVariables.TRAFFIC_SOURCE_ID,
    userToken: environmentVariables.TRAFFIC_SOURCE_TOKEN,
  });

  return {
    environmentVariables: {
      DARK_LOGO: environmentVariables.DARK_LOGO,
      LIGHT_LOGO: environmentVariables.LIGHT_LOGO,
      MOBILE_LOGO: environmentVariables.MOBILE_LOGO,
      SANCTON_CRM_PANEL_URL: environmentVariables.SANCTON_CRM_PANEL_URL,
      SANCTON_DONATION_CHECKOUT_URL:
        environmentVariables.SANCTON_DONATION_CHECKOUT_URL,
    },
    user,
  };
}

export default function RootRoute() {
  return <Outlet />;
}
