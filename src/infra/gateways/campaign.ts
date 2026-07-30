import { SearchResult } from "~/app/shared/searchResult";
import type { CampaignSearchParams } from "~/app/search/campaignSearchParams";
import type { Campaign } from "~/domain/entities/campaign";
import type {
  CampaignGatewayDTO,
  CreateCampaignInput,
  UpdateCampaignGeneralInfoInput,
  UpdateCampaignPageInput,
} from "~/domain/gateways/campaign";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { CampaignMapper } from "../mappers/campaign";
import {
  createCampaignResponseSchema,
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

  async createCampaign(
    input: CreateCampaignInput,
    token: string,
  ): Promise<{ id: string }> {
    const body = {
      name: input.name,
      slug: input.slug,
      type_donation: input.typeDonation,
      type: 1,
      subaccount_id: "019ab7b4-d0c3-7662-bac0-5a8377c51f7f",
      status: input.status,
      published: input.published,
      start_date: input.startDate,
      end_date: input.endDate,
      no_end_date: !input.endDate,
      phone: input.phone,
      cnpj: input.cnpj,
      institution_name: input.institutionName,
      image: input.image,
      address: input.address,
      image_mobile: input.imageMobile,
      featured_image: input.featuredImage,
      featured_video: input.videoUrl,
      description: input.description,
      project_category_id: input.projectCategoryId,
      total_goal: input.totalGoal,
      monthly_goal: input.monthlyGoal,
      preferences: {
        registration_title: input.registrationTitle,
        why_donate_title: input.whyDonateTitle,
        why_donate_text: input.whyDonateText,
        why_donate_image: input.whyDonateImage,
        about_us_title: input.aboutUsTitle,
        about_us_text: input.aboutUsText,
        about_us_image: input.aboutUsImage,
        whatsapp_project_support: input.supportWhatsapp,
        email_project_support: input.supportEmail,
        pix_enable: input.pixEnable,
        bankslip_enable: input.bankslipEnable,
        credit_enable: input.creditEnable,
        min_amount: input.minAmount,
        show_progress_bar: input.showProgressBar,
        progress_goal_type: input.progressGoalType,
      },
    };

    const apiResponse = await api.post(
      `/project/create/${input.accountId}`,
      { body, token },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(createCampaignResponseSchema);
    return schemaValidator.validate(apiResponse.response);
  }

  async updateCampaignGeneralInfo(
    input: UpdateCampaignGeneralInfoInput,
    token: string,
  ): Promise<void> {
    const body = {
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
    };

    const apiResponse = await api.put(`/project/update/${input.campaignId}`, {
      body,
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async updateCampaignPage(
    input: UpdateCampaignPageInput,
    token: string,
  ): Promise<void> {
    const body = {
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
      image_mobile: input.imageMobile,
      featured_video: input.videoUrl,
      featured_image: input.headerImage,
    };

    const apiResponse = await api.put(`/project/update/${input.campaignId}`, {
      body,
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { CampaignGateway };
