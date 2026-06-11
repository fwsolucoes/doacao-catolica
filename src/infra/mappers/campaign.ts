import { Campaign } from "~/domain/entities/campaign";
import type { ExternalCampaign } from "../schemas/external/campaign";

class CampaignMapper {
  static toEntity(externalCampaign: ExternalCampaign) {
    return Campaign.restore({
      id: externalCampaign.id,
      accountId: externalCampaign.account_id,
      name: externalCampaign.name,
      description: externalCampaign.description,
      address: externalCampaign.address,
      cnpj: externalCampaign.cnpj,
      email: externalCampaign.email,
      institutionName: externalCampaign.institution_name,
      monthlyGoal: externalCampaign.monthly_goal,
      noEndDate: externalCampaign.no_end_date,
      phone: externalCampaign.phone,
      published: externalCampaign.published,
      slug: externalCampaign.slug,
      startDate: externalCampaign.start_date,
      endDate: externalCampaign.end_date,
      currentRevenue: externalCampaign.current_revenue ?? null,
      status: externalCampaign.status,
      totalGoal: externalCampaign.total_goal,
      type: externalCampaign.type,
      typeDonation: externalCampaign.type_donation,
      image: externalCampaign.image,
      imageMobile: externalCampaign.image_mobile,
      createdAt: externalCampaign.created_at,
      updatedAt: externalCampaign.updated_at,
      apiDonationPublicId: externalCampaign.api_donation_public_id,
      subAccountId: externalCampaign.subaccount_id,
    });
  }
}

export { CampaignMapper };
