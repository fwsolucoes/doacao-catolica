import { SearchResult } from "~/app/shared/searchResult";
import { Fundraiser } from "~/domain/entities/fundraiser";
import { FundraiserDetails } from "~/domain/entities/fundraiserDetails";
import type {
  CreateFundraiserInput,
  FundraiserGatewayDTO,
} from "~/domain/gateways/fundraiser";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { webworkerApi } from "../http/webworkerApi";
import {
  externalFundraiserDetailsSchema,
  externalFundraisersSchema,
} from "../schemas/external/fundraiser";

class FundraiserGateway implements FundraiserGatewayDTO {
  async listFundraisers(
    campaignId: string,
    token: string,
  ): Promise<SearchResult<Fundraiser>> {
    const params = new URLSearchParams();
    params.set("filter[project_id]", campaignId);

    const apiResponse = await api.get(
      `/project-agent-invite/list?${params.toString()}`,
      { token },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalFundraisersSchema,
    );
    const externalFundraisers = schemaValidator.validate(apiResponse.response);

    return new SearchResult({
      data: externalFundraisers.items.map((item) =>
        Fundraiser.restore({
          id: item.id,
          projectId: item.project_id,
          inviteStatus: item.invite_status,
          inviterId: item.inviter_id,
          invitedUserId: item.invited_user_id,
          invitedUserEmail: item.invited_user_email,
          invitedUserName: item.invited_user_name,
          invitedUserPhone: item.invited_user_phone,
          createdAt: item.created_at,
        }),
      ),
      meta: {
        page: externalFundraisers.current_page,
        pageLimit: externalFundraisers.per_page,
        totalItems: externalFundraisers.total,
      },
    });
  }

  async listActiveFundraisers(
    campaignId: string,
    token: string,
    page: number,
  ): Promise<SearchResult<Fundraiser>> {
    const params = new URLSearchParams();
    params.set("filter[project_id]", campaignId);
    params.set("filter[invite_status]", "accepted");
    params.set("page", String(page));
    params.set("per_page", "20");

    const apiResponse = await api.get(
      `/project-agent-invite/list?${params.toString()}`,
      { token },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(externalFundraisersSchema);
    const externalFundraisers = schemaValidator.validate(apiResponse.response);

    return new SearchResult({
      data: externalFundraisers.items.map((item) =>
        Fundraiser.restore({
          id: item.id,
          projectId: item.project_id,
          inviteStatus: item.invite_status,
          inviterId: item.inviter_id,
          invitedUserId: item.invited_user_id,
          invitedUserEmail: item.invited_user_email,
          invitedUserName: item.invited_user_name,
          invitedUserPhone: item.invited_user_phone,
          createdAt: item.created_at,
        }),
      ),
      meta: {
        page: externalFundraisers.current_page,
        pageLimit: externalFundraisers.per_page,
        totalItems: externalFundraisers.total,
      },
    });
  }

  async createFundraiser(
    input: CreateFundraiserInput,
    token: string,
  ): Promise<void> {
    const apiResponse = await api.post("/project-agent/create", {
      body: {
        code: input.code,
        project_id: input.projectId,
        user_email: input.userEmail,
        percentage_comission: input.percentageCommission,
      },
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async cancelInviteFundraiser(id: string, token: string): Promise<void> {
    const apiResponse = await api.put(`/project-agent-invite/undo/${id}`, {
      body: {},
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async resendInviteFundraiser(id: string, token: string): Promise<void> {
    const apiResponse = await api.put(`/project-agent-invite/resend/${id}`, {
      body: {},
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async removeFundraiser(id: string, token: string): Promise<void> {
    const apiResponse = await api.put(`/project-agent-invite/cancel/${id}`, {
      body: {},
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async getFundraiserDetails(id: string): Promise<FundraiserDetails> {
    const headers = { "api-key": environmentVariables.API_KEY_DONATION };
    const apiResponse = await webworkerApi.get(`/donation/fundraisers/${id}`, {
      headers,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalFundraiserDetailsSchema,
    );
    const validated = schemaValidator.validate(apiResponse.response);
    const { data } = validated;

    return FundraiserDetails.restore({
      affiliateReference: data.affiliate_reference,
      totalIndications: data.total_indications,
      periodTotalRaisedAmount: data.period.total_raised_amount ?? null,
      last30DaysTotalIndications: data.last_30_days.total_indications,
      last30DaysTotalRaisedAmount: data.last_30_days.total_raised_amount,
      totalRecurringAmount: data.total_recurring_amount,
    });
  }
}

export { FundraiserGateway };
