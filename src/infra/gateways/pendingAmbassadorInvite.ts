import type {
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

    console.log(
      "🚀PendingAmbassadorInviteGateway.findAll apiResponse",
      apiResponse,
    );

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
}

export { PendingAmbassadorInviteGateway };
