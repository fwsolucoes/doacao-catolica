import { CampaignPaymentSettingsPage } from "~/client/pages/campaignPaymentSettings";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignPaymentSettingsRoute() {
  return <CampaignPaymentSettingsPage />;
}
