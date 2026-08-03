import { z } from "zod";

const externalCampaignPermissionsSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  user_id: z.number(),
  value: z.string(),
  status: z.boolean().optional(),
  role_id: z.uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  project_role: z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable(),
    project_role_permissions: z.array(
      z.object({
        project_permissions: z.object({
          id: z.uuid(),
          name: z.string(),
          description: z.string().nullable(),
          created_at: z.string(),
          updated_at: z.string(),
          deleted_at: z.string().nullable(),
        }),
      }),
    ),
  }),
});

export { externalCampaignPermissionsSchema };
