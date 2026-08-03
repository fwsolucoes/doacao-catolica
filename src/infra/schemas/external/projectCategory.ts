import { z } from "zod";

type ExternalProjectCategory = z.infer<typeof externalProjectCategorySchema>;

const externalProjectCategorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  order: z.number().nullable().optional(),
  active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
  deleted_at: z.string().nullable().optional(),
});

const listProjectCategoriesSchema = z.array(externalProjectCategorySchema);

export { listProjectCategoriesSchema, type ExternalProjectCategory };
