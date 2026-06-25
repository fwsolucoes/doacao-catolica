// src/infra/gateways/donor.ts
import type { DonorSearchParams } from "~/app/search/donorSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import { Donor } from "~/domain/entities/donor";
import type { CreateDonorInput, DonorGatewayDTO } from "~/domain/gateways/donor";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { createDonorResponseSchema } from "../schemas/external/createDonor";
import { externalDonorsListSchema } from "../schemas/external/donor";

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

    const schemaValidator = new SchemaValidatorAdapter(createDonorResponseSchema);
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

    const schemaValidator = new SchemaValidatorAdapter(externalDonorsListSchema);
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
}

export { DonorGateway };
