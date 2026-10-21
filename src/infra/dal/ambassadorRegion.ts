import type { AmbassadorRegionDalDTO } from "~/domain/dal/ambassadorRegion";
import { AmbassadorRegion } from "~/domain/views/ambassadorRegion";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { webworkerApi } from "../http/webworkerApi";
import { externalAmbassadorRegionsSchema } from "../schemas/external/ambassadorRegion";

class AmbassadorRegionDal implements AmbassadorRegionDalDTO {
  async listAll(campaignId: string): Promise<AmbassadorRegion[]> {
    const params = new URLSearchParams({ project_id: campaignId });

    const apiResponse = await webworkerApi.get(
      `/donation/ambassadors/comments?${params}`,
      { headers: { "api-key": environmentVariables.API_KEY_DONATION } },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const { data } = new SchemaValidatorAdapter(
      externalAmbassadorRegionsSchema,
    ).validate(apiResponse.response);

    return (data ?? []).map((value) => AmbassadorRegion.restore({ value }));
  }
}

export { AmbassadorRegionDal };
