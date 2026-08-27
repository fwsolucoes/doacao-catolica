import { PortalReportsPage } from "~/client/pages/portalReports";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function ReportsRoute() {
  return <PortalReportsPage />;
}
