import { z } from "zod";

const externalPendingAmbassadorInviteSchema = z.object({
  invite_id: z.string(),
  invite_created_at: z.string(),
  invited_user_role_id: z.string(),
  project_name: z.string(),
  project_end_date: z.string().nullable(),
  project_start_date: z.string().nullable(),
  project_image: z.string().nullable(),
  project_public_id: z.string(),
  inviting_user_name: z.string(),
});

const externalPendingAmbassadorInvitesSchema = z.array(
  externalPendingAmbassadorInviteSchema,
);

type ExternalPendingAmbassadorInvite = z.infer<
  typeof externalPendingAmbassadorInviteSchema
>;

export {
  externalPendingAmbassadorInvitesSchema,
  type ExternalPendingAmbassadorInvite,
};
