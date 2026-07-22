import { CampaignEmailPage } from "~/client/pages/campaignEmail";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignEmailRoute() {
  return <CampaignEmailPage />;
}
