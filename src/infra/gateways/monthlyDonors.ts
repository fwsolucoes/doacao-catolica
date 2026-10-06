import type { MonthlyDonorsSearchParams } from "~/app/search/monthlyDonorsSearchParams";
import { MonthlyDonors } from "~/domain/entities/monthlyDonors";
import type { MonthlyDonorsGatewayDTO } from "~/domain/gateways/monthlyDonors";
import type { MonthlyDonorsJson } from "~/domain/entities/monthlyDonors";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { webworkerApi } from "../http/webworkerApi";
import { externalMonthlyDonorsSchema } from "../schemas/external/monthlyDonors";

class MonthlyDonorsGateway implements MonthlyDonorsGatewayDTO {
  async getMonthlyDonors(
    searchParams: MonthlyDonorsSearchParams,
  ): Promise<MonthlyDonorsJson> {
    let url = `/donation/monthly-donors`;
    url += searchParams.toExternal(["pageLimit"]);

    const apiResponse = await webworkerApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(externalMonthlyDonorsSchema).validate(
      apiResponse.response,
    );

    const { pagination } = data.data;

    return MonthlyDonors.restore({
      months: data.data.months.map((month) => month.key),
      donors: data.data.donors.map((donor) => ({
        customerId: donor.customer_id,
        customerUuid: donor.customer_uuid,
        name: donor.name,
        document: donor.cpf_cnpj,
        phone: donor.phone,
        campaignName: donor.campaign.name,
        monthlyAmounts: donor.months,
        totalAmount: donor.total_amount,
      })),
      page: pagination.current_page,
      pageLimit: pagination.per_page,
      totalItems: pagination.total,
    }).toJson();
  }
}

export { MonthlyDonorsGateway };
