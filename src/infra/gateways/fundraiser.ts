import { SearchResult } from "~/app/shared/searchResult";
import { Fundraiser } from "~/domain/entities/fundraiser";
import type {
  CreateFundraiserInput,
  FundraiserGatewayDTO,
} from "~/domain/gateways/fundraiser";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { externalFundraisersSchema } from "../schemas/external/fundraiser";

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
}

export { FundraiserGateway };
