import { HelpPage } from "~/client/pages/help";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignHelpRoute() {
  return <HelpPage />;
}
