import type { DashboardPaymentMethodsSearchParams } from "~/app/search/dashboardPaymentMethodsSearchParams";
import type {
  DashboardPaymentMethodsData,
  DashboardPaymentMethodsGatewayDTO,
} from "~/domain/gateways/dashboardPaymentMethods";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalDashboardPaymentMethodsSchema } from "../schemas/external/dashboardPaymentMethods";

class DashboardPaymentMethodsGateway
  implements DashboardPaymentMethodsGatewayDTO
{
  async getPaymentMethods(
    accountUuid: string,
    searchParams: DashboardPaymentMethodsSearchParams,
  ): Promise<DashboardPaymentMethodsData> {
    let url = `/api/dashboard/payment-methods/${accountUuid}`;

    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalDashboardPaymentMethodsSchema,
    ).validate(apiResponse.response);

    return {
      totalAmount: data.data.total_amount,
      donationsCount: data.data.donations_count,
      paymentMethods: data.data.payment_methods.map((m) => ({
        paymentMethod: m.payment_method,
        donationsCount: m.donations_count,
        totalAmount: m.total_amount,
        percentage: m.percentage,
      })),
    };
  }
}

export { DashboardPaymentMethodsGateway };
