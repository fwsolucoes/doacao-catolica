import { CampaignWhatsappPage } from "~/client/pages/campaignWhatsapp";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignWhatsappRoute() {
  return <CampaignWhatsappPage />;
}
