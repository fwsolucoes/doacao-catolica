import { ListAmbassadorRegionsUseCase } from "~/app/useCases/ambassadorRegion/listAmbassadorRegionsUseCase";
import { ListAmbassadorRegionsController } from "~/infra/controllers/ambassadorRegion/listAmbassadorRegionsController";
import { AmbassadorRegionDal } from "~/infra/dal/ambassadorRegion";

const ambassadorRegionDal = new AmbassadorRegionDal();
const listAmbassadorRegionsUseCase = new ListAmbassadorRegionsUseCase(ambassadorRegionDal);
const listAmbassadorRegionsController = new ListAmbassadorRegionsController(
  listAmbassadorRegionsUseCase,
);

const listAmbassadorRegions = {
  handle: listAmbassadorRegionsController.handle.bind(listAmbassadorRegionsController),
};

export { listAmbassadorRegions };
