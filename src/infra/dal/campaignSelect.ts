import type { CampaignSelectDalDTO } from "~/domain/dal/campaignSelect";
import { CampaignSelect } from "~/domain/views/campaignSelect";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { campaignSelectSchema } from "../schemas/external/campaignSelect";

class CampaignSelectDal implements CampaignSelectDalDTO {
  async listAll(token: string): Promise<CampaignSelect[]> {
    const apiResponse = await api.get("/project/select", { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(campaignSelectSchema);
    const data = schemaValidator.validate(apiResponse.response);

    return data.map((item) => CampaignSelect.restore({ id: item.id, name: item.name }));
  }
}

export { CampaignSelectDal };
