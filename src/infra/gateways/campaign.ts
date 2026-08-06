import { SearchResult } from "~/app/shared/searchResult";
import type { CampaignSearchParams } from "~/app/search/campaignSearchParams";
import type { Campaign } from "~/domain/entities/campaign";
import type {
  CampaignGatewayDTO,
  CreateCampaignInput,
  UpdateCampaignWithDetailsInput,
  GetProjectPermissionsOutput,
} from "~/domain/gateways/campaign";
import { PROJECT_ALL_PERMISSIONS } from "~/app/template/PROJECT_ALL_PERMISSIONS";
import { externalCampaignPermissionsSchema } from "../schemas/external/campaignPermissions";
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

import { environmentVariables } from "~/main/config/environmentVariables";

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
      subaccount_id: environmentVariables.SUB_ACCOUNT_ID,
      status: input.status,
      visible_in_marketplace: input.published,
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

    const apiResponse = await api.post(`/project/create/${input.accountId}`, {
      body,
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      createCampaignResponseSchema,
    );
    return schemaValidator.validate(apiResponse.response);
  }

  async updateCampaignWithDetails(
    input: UpdateCampaignWithDetailsInput,
    token: string,
  ): Promise<void> {
    const preferencesBody = {
      registration_title: input.title,
      registration_text: input.description,
      why_donate_title: input.whyDonateTitle,
      why_donate_text: input.whyDonateText,
      why_donate_image: input.whyDonateImage,
      about_us_title: input.aboutTitle,
      about_us_text: input.aboutText,
      about_us_image: input.aboutImage,
      whatsapp_project_support: input.supportWhatsapp,
      email_project_support: input.supportEmail,
      pix_enable: input.pixEnabled,
      bankslip_enable: input.boletoEnabled,
      credit_enable: input.creditCardEnabled,
      min_amount: input.minAmount,
      allow_transfer_taxes: input.passFeeToDonor,
      show_custom_amount_option: input.allowCustomAmount,
      generate_payment_immediately: input.chargeImmediately,
      email_sender_name: input.emailSenderName,
      email_reply_to: input.emailReplyTo,
      nomenclature: input.nomenclature,
      support_tag_id: input.supportTagId,
      show_auto_pix_invite: input.showAutoPixInvite,
      require_login: input.requireLogin,
    };

    const hasPreferences = Object.values(preferencesBody).some(
      (v) => v !== undefined,
    );

    const metaTagBody = {
      title: input.metaTitle,
      description: input.metaDescription,
    };
    const hasMetaTag = Object.values(metaTagBody).some((v) => v !== undefined);

    const body = {
      name: input.name,
      slug: input.slug,
      status: input.status,
      visible_in_marketplace: input.visibleInMarketplace,
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
      image: input.image,
      image_mobile: input.imageMobile,
      featured_video: input.videoUrl,
      featured_image: input.headerImage,
      url_thank_you_recurring_signup: input.redirectAfterRegistration,
      url_thank_you_single: input.redirectAfterOneTimePayment,
      url_thank_you_recurring: input.redirectAfterRecurringPayment,
      ...(hasPreferences ? { preferences: preferencesBody } : {}),
      ...(hasMetaTag ? { projectMetatag: metaTagBody } : {}),
    };

    const apiResponse = await api.put(
      `/project/update-with-details/${input.campaignId}`,
      { body, token },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async getProjectPermissions(
    projectId: string,
    userId: string,
    token: string,
  ): Promise<GetProjectPermissionsOutput> {
    if (process.env.NODE_ENV === "development") {
      return {
        projectRole: { name: "Administrador" },
        projectPermissions: [...PROJECT_ALL_PERMISSIONS],
      };
    }

    const url = `/user/get-role/project-id/${projectId}/user-id/${userId}`;
    const apiResponse = await api.get(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalCampaignPermissionsSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return {
      projectRole: { name: data.project_role.name },
      projectPermissions: data.project_role.project_role_permissions.map(
        (p) => p.project_permissions.name,
      ),
    };
  }
}

export { CampaignGateway };
