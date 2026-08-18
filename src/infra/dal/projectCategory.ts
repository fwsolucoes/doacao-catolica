import type { ProjectCategoryDalDTO } from "~/domain/dal/projectCategory";
import { ProjectCategory } from "~/domain/views/projectCategory";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { listProjectCategoriesSchema } from "../schemas/external/projectCategory";

class ProjectCategoryDal implements ProjectCategoryDalDTO {
  async listAll(token: string): Promise<ProjectCategory[]> {
    const apiResponse = await api.get("/select/project-categories", { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(listProjectCategoriesSchema);
    const externalCategories = schemaValidator.validate(apiResponse.response);

    return externalCategories.map((item) =>
      ProjectCategory.restore({ id: item.id, name: item.name }),
    );
  }
}

export { ProjectCategoryDal };
