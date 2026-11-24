import type { RegistrationsWithoutDonationsSearchParams } from "~/app/search/registrationsWithoutDonationsSearchParams";
import { RegistrationsWithoutDonations } from "~/domain/entities/registrationsWithoutDonations";
import type { RegistrationsWithoutDonationsJson } from "~/domain/entities/registrationsWithoutDonations";
import type { RegistrationsWithoutDonationsGatewayDTO } from "~/domain/gateways/registrationsWithoutDonations";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { webworkerApi } from "../http/webworkerApi";
import { externalRegistrationsWithoutDonationsSchema } from "../schemas/external/registrationsWithoutDonations";

class RegistrationsWithoutDonationsGateway
  implements RegistrationsWithoutDonationsGatewayDTO
{
  async getRegistrationsWithoutDonations(
    searchParams: RegistrationsWithoutDonationsSearchParams,
  ): Promise<RegistrationsWithoutDonationsJson> {
    let url = "/donation/registrations-without-donations";
    url += searchParams.toExternal(["pageLimit"]);

    const apiResponse = await webworkerApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalRegistrationsWithoutDonationsSchema,
    ).validate(apiResponse.response);

    const { summary, pagination, registrations } = data.data;

    return RegistrationsWithoutDonations.restore({
      totalCount: summary.total_registrations,
      recurringCount: summary.recurring_count,
      oneTimeCount: summary.one_time_count,
      monthlyPotentialAmount: summary.monthly_potential_amount,
      registrations: registrations.map((item) => ({
        customerId: item.customer_id,
        customerUuid: item.customer_uuid,
        name: item.name,
        document: item.cpf_cnpj,
        phone: item.phone,
        email: item.email,
        amount: item.amount,
        paymentMethodLabel: item.payment_method_label,
        typeLabel: item.type_label,
        createdAt: item.created_at,
      })),
      page: pagination.current_page,
      totalPages: pagination.last_page,
      totalItems: pagination.total,
    }).toJson();
  }
}

export { RegistrationsWithoutDonationsGateway };
