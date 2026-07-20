import { SearchResult } from "~/app/shared/searchResult";
import type { CampaignSearchParams } from "~/app/search/campaignSearchParams";
import type { Campaign } from "~/domain/entities/campaign";
import type {
  CampaignGatewayDTO,
  UpdateCampaignGeneralInfoInput,
} from "~/domain/gateways/campaign";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { CampaignMapper } from "../mappers/campaign";
import {
  externalCampaignSchema,
  listCampaignsSchema,
  verifySlugSchema,
} from "../schemas/external/campaign";

class CampaignGateway implements CampaignGatewayDTO {
  async listCampaigns(
    searchParams: CampaignSearchParams,
    token: string,
  ): Promise<SearchResult<Campaign>> {
    let url = "/project/summary-list";
    url += searchParams.toExternal();

    const apiResponse = await api.get(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(listCampaignsSchema);
    const externalCampaigns = schemaValidator.validate(apiResponse.response);

    return new SearchResult({
      data: externalCampaigns.data.map(CampaignMapper.toEntity),
      meta: {
        page: externalCampaigns.meta.currentPage,
        pageLimit: externalCampaigns.meta.itemsPerPage,
        totalItems: externalCampaigns.meta.totalItems,
      },
    });
  }

  async getCampaign(id: string, token: string): Promise<Campaign> {
    const apiResponse = await api.get(`/project/find-one/${id}`, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(externalCampaignSchema);
    const externalCampaign = schemaValidator.validate(apiResponse.response);

    return CampaignMapper.toEntity(externalCampaign);
  }

  async verifySlug(
    slug: string,
    token: string,
  ): Promise<{ available: boolean }> {
    const apiResponse = await api.get(`/project/verify-slug/${slug}`, {
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(verifySlugSchema);
    const { isSlugInUse } = schemaValidator.validate(apiResponse.response);

    return { available: !isSlugInUse };
  }

  async updateCampaignGeneralInfo(
    input: UpdateCampaignGeneralInfoInput,
    token: string,
  ): Promise<void> {
    const apiResponse = await api.put(`/project/update/${input.campaignId}`, {
      body: {
        name: input.name,
        slug: input.slug,
        status: input.status,
        published: input.published,
        start_date: input.startDate,
        end_date: input.endDate,
        no_end_date: input.noEndDate,
        phone: input.phone,
        type_donation: input.typeDonation,
        total_goal: input.totalGoal,
        monthly_goal: input.monthlyGoal,
        institution_name: input.institutionName,
        cnpj: input.cnpj,
        address: input.address,
        subaccount_id: input.subAccountId,
        email: input.email,
        type: input.type,
        description: input.description,
        image: input.image,
      },
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { CampaignGateway };
