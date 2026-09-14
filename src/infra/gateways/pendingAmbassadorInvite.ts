import type {
  AcceptAmbassadorInvitationInput,
  PendingAmbassadorInviteGatewayDTO,
  PendingAmbassadorInvitesResult,
} from "~/domain/gateways/pendingAmbassadorInvite";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { PendingInviteMapper } from "../mappers/pendingInvite";
import { externalPendingAmbassadorInvitesSchema } from "../schemas/external/pendingAmbassadorInvite";

class PendingAmbassadorInviteGateway implements PendingAmbassadorInviteGatewayDTO {
  async findAll(
    email: string,
    token: string,
  ): Promise<PendingAmbassadorInvitesResult> {
    const encodedEmail = encodeURIComponent(email);
    const apiResponse = await api.get(`/list-agent-invites/${encodedEmail}`, {
      token,
    });

    if (!apiResponse.success) {
      throw HttpAdapter.badRequest(apiResponse.message, apiResponse.response);
    }

    const validator = new SchemaValidatorAdapter(
      externalPendingAmbassadorInvitesSchema,
    );
    const response = validator.validate(apiResponse.response);

    return {
      items: response.map((invite) => PendingInviteMapper.toEntity(invite)),
    };
  }

  async acceptInvitation(
    input: AcceptAmbassadorInvitationInput,
    token: string,
  ): Promise<void> {
    const apiResponse = await api.post("/project-agent/create", {
      body: {
        project_id: input.projectId,
        user_email: input.userEmail,
      },
      token,
    });

    if (!apiResponse.success) {
      throw HttpAdapter.badRequest(apiResponse.message, apiResponse.response);
    }
  }
}

export { PendingAmbassadorInviteGateway };
