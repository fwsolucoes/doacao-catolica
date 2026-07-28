import { z } from "zod";

type ExternalInviteCollaborator = z.infer<
  typeof externalInviteCollaboratorSchema
>;

const externalInviteCollaboratorSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  invite_status: z.string(),
  inviter_id: z.number(),
  invited_user_id: z.number().nullable(),
  invited_user_email: z.string(),
  invited_user_name: z.string(),
  invited_user_phone: z.string().nullable(),
  invited_user_role_id: z.string(),
  created_at: z.string(),
});

const externalInvitesCollaboratorsSchema = z.object({
  items: z.array(externalInviteCollaboratorSchema),
  total: z.number(),
  current_page: z.number(),
  per_page: z.number(),
  last_page: z.number(),
});

export {
  externalInvitesCollaboratorsSchema,
  type ExternalInviteCollaborator,
};
