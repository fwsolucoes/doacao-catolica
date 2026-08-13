import { FundraisersPage } from "~/client/pages/fundraisers";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function FundraisersRoute() {
  return <FundraisersPage />;
}
