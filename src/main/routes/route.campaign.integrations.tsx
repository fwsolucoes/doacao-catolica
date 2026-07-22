import { CampaignIntegrationsPage } from "~/client/pages/campaignIntegrations";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignIntegrationsRoute() {
  return <CampaignIntegrationsPage />;
}
