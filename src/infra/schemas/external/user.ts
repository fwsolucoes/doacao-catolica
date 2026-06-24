import z from "zod";

type ExternalUser = z.infer<typeof externalUserSchema>;

const externalTokenSchema = z.object({
  jwt: z.string(),
});

const externalUserSchema = z.object({
  id: z.number(),
  provider: z.enum(["facebook", "google", "password"]),
  register_provider: z.enum(["facebook", "google", "password"]),
  name: z.string(),
  email: z.email(),
  phone: z.string(),
  sign_in_count: z.number(),
  current_sign_in_at: z.string(),
  last_sign_in_at: z.string().nullable(),
  current_sign_in_ip: z.string().nullable(),
  last_sign_in_ip: z.string().nullable(),
  confirmation_token: z.string().nullable(),
  confirmed_at: z.string().nullable(),
  confirmation_sent_at: z.string().nullable(),
  unconfirmed_email: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  custom_attributes: z.object({}),
  type: z.string().nullable(),
  uuid: z.string(),
  avatar: z.string().nullable(),
  account_id: z.number(),
});

const externalUserSchemaSuperAdmin = z.object({
  id: z.number(),
  accountId: z.number(),
  avatar: z.string().nullable(),
  verified: z.boolean(),
  uuid: z.uuid(),
  name: z.string(),
  email: z.string(),
});

export { externalTokenSchema, externalUserSchema, type ExternalUser };
