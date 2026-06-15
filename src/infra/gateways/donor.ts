import type { CreateDonorInput, DonorGatewayDTO } from "~/domain/gateways/donor";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { createDonorResponseSchema } from "../schemas/external/createDonor";

class DonorGateway implements DonorGatewayDTO {
  async createDonor(input: CreateDonorInput): Promise<string> {
    const birthDate = input.birthDate
      ? new Date(input.birthDate).toISOString()
      : null;

    const apiResponse = await api.post("/create-donator-contact", {
      body: {
        contactData: {
          account_id: input.accountId,
          name: input.name,
          cpf: input.cpf ?? null,
          birth_date: birthDate,
          contactInfo: {
            email: input.email,
            phone: input.phone,
          },
        },
        customForms: [],
        project_id: input.projectId,
      },
      token: input.token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(createDonorResponseSchema);
    const data = schemaValidator.validate(apiResponse.response);

    return data.donator.id;
  }
}

export { DonorGateway };
