import { FinancialSummaryPage } from "~/client/pages/financialSummary";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function FinancialSummaryRoute() {
  return <FinancialSummaryPage />;
}
