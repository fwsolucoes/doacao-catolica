import type { SuggestedValue } from "~/domain/entities/suggestedValue";
import { SuggestedValue as SuggestedValueEntity } from "~/domain/entities/suggestedValue";
import type { SuggestedValueGatewayDTO } from "~/domain/gateways/suggestedValue";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { externalSuggestedValuesSchema } from "../schemas/external/suggestedValue";

class SuggestedValueGateway implements SuggestedValueGatewayDTO {
  async list(campaignId: string, token: string): Promise<SuggestedValue[]> {
    const url = `/${environmentVariables.API_DATABASE}/projectPlan/find-all/by-project/${campaignId}`;
    const apiResponse = await api.get(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const validator = new SchemaValidatorAdapter(externalSuggestedValuesSchema);
    const data = validator.validate(apiResponse.response);

    return data.data.map((item) =>
      SuggestedValueEntity.restore({
        id: item.id,
        description: item.name,
        amount: item.amount,
      }),
    );
  }

  async create(description: string, amount: number, campaignId: string, token: string): Promise<void> {
    const url = `/${environmentVariables.API_DATABASE}/create/projectPlan`;
    const apiResponse = await api.post(url, {
      body: { name: description, amount, project_id: campaignId },
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async update(id: string, description: string, amount: number, token: string): Promise<void> {
    const url = `/${environmentVariables.API_DATABASE}/update/${id}/projectPlan`;
    const apiResponse = await api.put(url, {
      body: { name: description, amount },
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async delete(id: string, token: string): Promise<void> {
    const url = `/${environmentVariables.API_DATABASE}/delete/${id}/projectPlan`;
    const apiResponse = await api.delete(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { SuggestedValueGateway };
