import { z } from "zod";

const externalSuggestedValueSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  amount: z.string().transform(Number),
  project_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const externalSuggestedValuesSchema = z.object({
  data: z.array(externalSuggestedValueSchema),
  meta: z.object({
    currentPage: z.number(),
    itemsPerPage: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    sortBy: z.array(z.string()),
  }),
});

type ExternalSuggestedValue = z.infer<typeof externalSuggestedValueSchema>;

export { externalSuggestedValueSchema, externalSuggestedValuesSchema, type ExternalSuggestedValue };
