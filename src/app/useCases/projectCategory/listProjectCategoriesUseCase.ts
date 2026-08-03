import type { ProjectCategoryDalDTO } from "~/domain/dal/projectCategory";

class ListProjectCategoriesUseCase {
  constructor(private projectCategoryDal: ProjectCategoryDalDTO) {}

  async execute(token: string) {
    const categories = await this.projectCategoryDal.listAll(token);
    return categories.map((category) => category.toJson());
  }
}

export { ListProjectCategoriesUseCase };
