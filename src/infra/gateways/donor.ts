// src/infra/gateways/donor.ts
import type { DonorSearchParams } from "~/app/search/donorSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import { Donor } from "~/domain/entities/donor";
import { RecurringDonor } from "~/domain/entities/recurringDonor";
import type {
  CreateDonorInput,
  DonorGatewayDTO,
  DonorsSummary,
} from "~/domain/gateways/donor";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { donationApi } from "../http/donationApi";
import { createDonorResponseSchema } from "../schemas/external/createDonor";
import { externalDonorsListSchema } from "../schemas/external/donor";
import { donorsSummaryResponseSchema } from "../schemas/external/donorsSummary";
import { recurringDonorsResponseSchema } from "../schemas/external/recurringDonors";

class DonorGateway implements DonorGatewayDTO {
  async createDonor(input: CreateDonorInput): Promise<string> {
    const birthDate = input.birthDate
      ? new Date(input.birthDate).toISOString()
      : null;

    const apiResponse = await api.post("/create-donator-contact", {
      body: {
        contactData: {
          account_id: input.accountId,
          name: input.name,
          cpf: input.cpf ?? null,
          birth_date: birthDate,
          contactInfo: {
            email: input.email,
            phone: input.phone,
          },
        },
        customForms: [],
        project_id: input.projectId,
      },
      token: input.token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      createDonorResponseSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return data.donator.id;
  }

  async listDonors(
    projectId: string,
    accountId: number,
    searchParams: DonorSearchParams,
    token: string,
  ): Promise<SearchResult<Donor>> {
    let url = `/donators/find-all/${projectId}/${accountId}`;
    url += searchParams.toExternal([]);

    const apiResponse = await api.get(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalDonorsListSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return new SearchResult({
      data: data.data.map((item) =>
        Donor.restore({
          id: item.id,
          contactId: item.contact_id,
          name: item.contact.name,
          email: item.contact.contact_info.email || null,
          cpf: item.contact.cpf,
          birthDate: item.contact.birth_date,
          phone: item.contact.contact_info.phone,
          whatsapp: item.contact.contact_info.whatsapp,
          donorType: item.is_recurrent ? "Recorrente" : "Pontual",
          createdAt: item.created_at,
        }),
      ),
      meta: {
        page: data.meta.currentPage,
        pageLimit: data.meta.itemsPerPage,
        totalItems: data.meta.totalItems,
      },
    });
  }

  async getDonorsSummary(campaignId: string): Promise<DonorsSummary> {
    const url = `/api/donors/summary/${campaignId}`;

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      donorsSummaryResponseSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return {
      totalDonors: data.data.total_donors,
      recurringDonors: data.data.recurring_donors,
      oneTimeDonors: data.data.one_time_donors,
      newDonorsThisMonth: data.data.new_donors_this_month,
      newDonorsPreviousMonth: data.data.new_donors_previous_month,
      newDonorsVariationPercentage: data.data.new_donors_variation_percentage,
      totalRecurringAmount: data.data.total_recurring_amount,
      averageDonationAmount: data.data.average_donation_amount,
    };
  }

  async listRecurringDonors(
    campaignId: string,
    searchParams: DonorSearchParams,
  ): Promise<SearchResult<RecurringDonor>> {
    let url = `/api/donors/recurring/${campaignId}`;
    url += searchParams.toExternal([]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      recurringDonorsResponseSchema,
    );
    const { data } = schemaValidator.validate(apiResponse.response);

    return new SearchResult({
      data: data.data.map((item) =>
        RecurringDonor.restore({
          subscriptionUuid: item.subscription_uuid,
          customerUuid: item.customer.uuid,
          customerReference: item.customer.reference,
          name: item.customer.name,
          cpf: item.customer.cpf_cnpj,
          email: item.customer.email,
          phone: item.customer.phone,
          donationsLast12Months: item.donations_last_12_months,
          lastDonationAt: item.last_donation_at,
          status: item.status,
          activeNotification: item.active_notification,
          amount: item.amount,
          payDay: item.pay_day,
          paymentMethod: item.payment_method,
          registeredAt: item.registered_at,
        }),
      ),
      meta: {
        page: data.current_page,
        pageLimit: data.per_page,
        totalItems: data.total,
      },
    });
  }
}

export { DonorGateway };
