import type { AmbassadorRegionDalDTO } from "~/domain/dal/ambassadorRegion";

class ListAmbassadorRegionsUseCase {
  constructor(private ambassadorRegionDal: AmbassadorRegionDalDTO) {}

  async execute(campaignId: string) {
    const regions = await this.ambassadorRegionDal.listAll(campaignId);
    return regions.map((region) => region.toJson());
  }
}

export { ListAmbassadorRegionsUseCase };
