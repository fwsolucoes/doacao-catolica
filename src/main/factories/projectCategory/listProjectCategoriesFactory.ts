import { ListProjectCategoriesUseCase } from "~/app/useCases/projectCategory/listProjectCategoriesUseCase";
import { ListProjectCategoriesController } from "~/infra/controllers/projectCategory/listProjectCategoriesController";
import { ProjectCategoryDal } from "~/infra/dal/projectCategory";

const projectCategoryDal = new ProjectCategoryDal();
const listProjectCategoriesUseCase = new ListProjectCategoriesUseCase(projectCategoryDal);
const listProjectCategoriesController = new ListProjectCategoriesController(
  listProjectCategoriesUseCase,
);

const listProjectCategories = {
  handle: listProjectCategoriesController.handle.bind(listProjectCategoriesController),
};

export { listProjectCategories };
