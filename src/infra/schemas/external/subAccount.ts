import { z } from "zod";

const externalSubAccountSchema = z
  .object({
    subaccount_id: z.string(),
    account_id: z.number(),
    name: z.string(),
    email: z.string(),
    login_email: z.string(),
    phone: z.string(),
    mobile_phone: z.string(),
    address: z.string(),
    address_number: z.string(),
    complement: z.string().nullable(),
    province: z.string(),
    postal_code: z.string(),
    cpf_cnpj: z.string(),
    birth_date: z.string(),
    person_type: z
      .string()
      .refine(
        (data) => ["PJ", "PF"].includes(data.toUpperCase()),
        "Invalid person type",
      )
      .transform((data) => {
        if (data.toUpperCase() === "PJ") return "PJ";
        if (data.toUpperCase() === "PF") return "PF";
        throw new Error(`Invalid person type ${data}`);
      }),
    company_type: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    trading_name: z.string(),
    site: z.string(),
    income_range: z.string(),
    gateway_id: z.string().nullable(),
    api_key: z.string(),
    wallet_id: z.string(),
    gateway_status: z.number(),
    last_sync_date: z.string(),
    response_status: z.string(),
    diocese_id: z.string().nullable(),
    institution_name: z.string().nullable(),
    domain_origin: z.string().nullable(),
    institution_type_id: z.string().nullable(),
    institution_phone: z.string().nullable(),
    institution_description: z.string(),
    instagram_profile: z.string().nullable(),
    facebook_profile: z.string().nullable(),
    admin_comments: z.string().nullable(),
    admin_is_approved: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .strict();

const externalSubAccountsSchema = z
  .object({
    data: z.array(externalSubAccountSchema),
    meta: z
      .object({
        current_page: z.number(),
        items_per_page: z.number(),
        total_items: z.number(),
        total_pages: z.number(),
        sort_by: z.array(z.string()),
      })
      .strict(),
  })
  .strict();

type ExternalSubAccount = z.infer<typeof externalSubAccountSchema>;

export { externalSubAccountsSchema, type ExternalSubAccount };
