import { SearchResult } from "~/app/shared/searchResult";
import { InviteCollaborator } from "~/domain/entities/inviteCollaborator";
import type {
  AcceptInvitationInput,
  CreateInviteCollaboratorInput,
  InviteCollaboratorGatewayDTO,
  UpdateInviteCollaboratorInput,
} from "~/domain/gateways/inviteCollaborator";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { externalInvitesCollaboratorsSchema } from "../schemas/external/inviteCollaborator";

class InviteCollaboratorGateway implements InviteCollaboratorGatewayDTO {
  async acceptInvitation(
    input: AcceptInvitationInput,
    token: string,
  ): Promise<void> {
    const apiResponse = await api.post("/project-user/create", {
      body: {
        role_id: input.roleId,
        user_email: input.userEmail,
        project_id: input.projectId,
      },
      token,
    });

    if (!apiResponse.success) {
      throw HttpAdapter.badRequest(apiResponse.message, apiResponse.response);
    }
  }

  async declineInvitation(id: string, token: string): Promise<void> {
    const apiResponse = await api.put(`/project-user-invite/cancel/${id}`, {
      body: {},
      token,
    });

    if (!apiResponse.success) {
      throw HttpAdapter.badRequest(apiResponse.message, apiResponse.response);
    }
  }

  async createInviteCollaborator(
    input: CreateInviteCollaboratorInput,
    token: string,
  ): Promise<void> {
    const apiResponse = await api.post("/project-user-invite/create", {
      body: {
        token,
        project_id: input.projectId,
        inviter_id: input.inviterId,
        invited_user_email: input.invitedUserEmail,
        invited_user_role_id: input.invitedUserRoleId,
        invited_user_name: input.invitedUserEmail,
      },
      token,
    });

    console.log("🚀~~ apiResponse", apiResponse);

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async updateInviteCollaborator(
    input: UpdateInviteCollaboratorInput,
    token: string,
  ): Promise<void> {
    const apiResponse = await api.put(`/project_user/update/${input.id}`, {
      body: { role_id: input.roleId },
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async resendInviteCollaborator(id: string, token: string): Promise<void> {
    const apiResponse = await api.put(`/project-user-invite/resend/${id}`, {
      body: {},
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async deleteInviteCollaborator(id: string, token: string): Promise<void> {
    const apiResponse = await api.delete(`/project_user/disable/${id}`, {
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async listInviteCollaborators(
    campaignId: string,
    token: string,
  ): Promise<SearchResult<InviteCollaborator>> {
    const params = new URLSearchParams();
    params.set("filter[project_id]", campaignId);

    const apiResponse = await api.get(
      `/project-user-invite/list?${params.toString()}`,
      { token },
    );

    console.log("🚀~~ apiResponse", apiResponse);
    console.log("🚀~~ apiResponse", apiResponse.response.items);

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalInvitesCollaboratorsSchema,
    );
    const externalInvitesCollaborators = schemaValidator.validate(
      apiResponse.response,
    );

    return new SearchResult({
      data: externalInvitesCollaborators.items.map((invite) =>
        InviteCollaborator.restore({
          id: invite.id,
          projectId: invite.project_id,
          inviteStatus: invite.invite_status,
          inviterId: invite.inviter_id,
          invitedUserId: invite.invited_user_id,
          invitedUserEmail: invite.invited_user_email,
          invitedUserName: invite.invited_user_name,
          invitedUserPhone: invite.invited_user_phone,
          invitedUserRoleId: invite.invited_user_role_id,
          createdAt: invite.created_at,
        }),
      ),
      meta: {
        page: externalInvitesCollaborators.current_page,
        pageLimit: externalInvitesCollaborators.per_page,
        totalItems: externalInvitesCollaborators.total,
      },
    });
  }
}

export { InviteCollaboratorGateway };
