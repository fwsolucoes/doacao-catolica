import type { User } from "~/domain/entities/user";
import type { UserGatewayDTO } from "~/domain/gateways/user";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { UserMapper } from "../mappers/user";
import { externalUserSchema } from "../schemas/external/user";

import { environmentVariables as env } from "~/main/config/environmentVariables";

class UserGateway implements UserGatewayDTO {
  async meUser(token: string): Promise<User> {
    const url = `/${env.API_DATABASE}/me`;
    const apiResponse = await api.get(url, {
      token,
    });
    console.log("apiResponse", apiResponse);

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(externalUserSchema);
    const validatedExternalData = schemaValidator.validate(
      apiResponse.response,
    );

    return UserMapper.toEntity(validatedExternalData, token);
  }
}

export { UserGateway };
