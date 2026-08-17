// import type { ProjectCategoryDalDTO } from "~/domain/dal/projectCategory";
// import { ProjectCategory } from "~/domain/views/projectCategory";
// import { HttpAdapter } from "../adapters/httpAdapter";
// import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
// import { api } from "../http/api";
// import { listProjectCategoriesSchema } from "../schemas/external/projectCategory";

// class ProjectCategoryDal implements ProjectCategoryDalDTO {
//   async listAll(token: string): Promise<ProjectCategory[]> {
//     const apiResponse = await api.get("/select/project-categories", { token });

//     if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

//     const schemaValidator = new SchemaValidatorAdapter(listProjectCategoriesSchema);
//     const externalCategories = schemaValidator.validate(apiResponse.response);

//     return externalCategories.map((item) =>
//       ProjectCategory.restore({ id: item.id, name: item.name }),
//     );
//   }
// }

// export { ProjectCategoryDal };

import type { ProjectCategoryDalDTO } from "~/domain/dal/projectCategory";
import { ProjectCategory } from "~/domain/views/projectCategory";

// TODO: replace with real API call when server is available
const MOCK_CATEGORIES = [
  { id: "1", name: "Paróquia" },
  { id: "2", name: "Comunidade" },
  { id: "3", name: "Missão" },
  { id: "4", name: "Outro" },
  { id: "5", name: "Dízimo" },
  { id: "6", name: "Apostolado" },
  { id: "7", name: "Obras e Reformas" },
  { id: "8", name: "Ação social" },
  { id: "9", name: "Evento" },
];

class ProjectCategoryDal implements ProjectCategoryDalDTO {
  async listAll(_token: string): Promise<ProjectCategory[]> {
    return MOCK_CATEGORIES.map((item) =>
      ProjectCategory.restore({ id: item.id, name: item.name }),
    );
  }
}

export { ProjectCategoryDal };
