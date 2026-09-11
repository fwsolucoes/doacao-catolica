import type { DefaultingDonorsSearchParams } from "~/app/search/defaultingDonorsSearchParams";
import { DefaultingDonors } from "~/domain/entities/defaultingDonors";
import type { DefaultingDonorsGatewayDTO } from "~/domain/gateways/defaultingDonors";
import type { DefaultingDonorsJson } from "~/domain/entities/defaultingDonors";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { webworkerApi } from "../http/webworkerApi";
import { externalDefaultingDonorsSchema } from "../schemas/external/defaultingDonors";

class DefaultingDonorsGateway implements DefaultingDonorsGatewayDTO {
  async getDefaultingDonors(
    searchParams: DefaultingDonorsSearchParams,
  ): Promise<DefaultingDonorsJson> {
    let url = `/donation/defaulting-donors`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await webworkerApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalDefaultingDonorsSchema,
    ).validate(apiResponse.response);

    const s = data.data.summary;

    return DefaultingDonors.restore({
      totalDefaultingDonors: s.total_defaulting_donors,
      totalPendingAmount: s.total_pending_amount,
      averageAmountPerDonor: s.average_amount_per_donor,
      averageMonthlyAmount: s.average_monthly_amount,
      donors: data.data.donors.map((d) => ({
        customerId: d.customer_id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        createdAt: d.created_at,
        unpaidDonationsCount: d.unpaid_donations_count,
        pendingAmount: d.pending_amount,
        totalPaidAmount: d.total_paid_amount,
        totalPaidDonationsCount: d.total_paid_donations_count,
      })),
    }).toJson();
  }
}

export { DefaultingDonorsGateway };
