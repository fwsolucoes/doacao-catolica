import type { ProjectCategory } from "../views/projectCategory";

type ProjectCategoryDalDTO = {
  listAll: (token: string) => Promise<ProjectCategory[]>;
};

export type { ProjectCategoryDalDTO };
