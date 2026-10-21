import type { AmbassadorRegion } from "../views/ambassadorRegion";

type AmbassadorRegionDalDTO = {
  listAll: (campaignId: string) => Promise<AmbassadorRegion[]>;
};

export type { AmbassadorRegionDalDTO };
