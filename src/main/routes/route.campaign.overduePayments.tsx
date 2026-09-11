import type { Route } from "+/route.campaign.overduePayments";
import { OverduePaymentsPage } from "~/client/pages/overduePayments";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { getFormAction } from "~/lib/getFormAction";
import { createOverduePaymentsIframeUrl } from "~/lib/metabase.server";

const DEFAULT_MONTH_QUANTITY = 3;
const ACTION_GENERATE_REPORT = "generateReport";

export async function action({ request, params }: Route.ActionArgs) {
  try {
    const { _action } = await getFormAction(request);

    if (_action === ACTION_GENERATE_REPORT) {
      const formData = await request.formData();
      const monthQuantity =
        Number(formData.get("monthQuantity")) || DEFAULT_MONTH_QUANTITY;
      const projectPublicId = params.campaignId;

      if (!projectPublicId) {
        throw new Error("projectPublicId is required");
      }

      return {
        success: true,
        iframeUrl: createOverduePaymentsIframeUrl(
          projectPublicId,
          monthQuantity,
        ),
      };
    }

    return { error: "Ação não reconhecida" };
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}

export default function OverduePaymentsRoute() {
  return <OverduePaymentsPage />;
}
