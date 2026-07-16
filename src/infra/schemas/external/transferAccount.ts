import { z } from "zod";

const externalTransferAccountSchema = z.object({
  id: z.string(),
  account_id: z.number(),
  type: z.string().nullable(),
  name: z.string().nullable().optional(),
  cpf_cnpj: z.string().nullable(),
  document_url: z.string().nullable().optional(),
  pix_key: z.string().nullable(),
  pix_type: z.string().nullable(),
  agency: z.string().nullable(),
  responsible_birthday: z.string().nullable().optional(),
  responsible_name: z.string().nullable().optional(),
  responsible_phone: z.string().nullable().optional(),
  bank: z.string().nullable(),
  bank_account: z.string().nullable(),
  bank_account_type: z.string().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  deleted_at: z.string().nullable().optional(),
});

const externalTransferAccountsSchema = z.object({
  items: z.array(externalTransferAccountSchema),
  total: z.number(),
  current_page: z.number(),
  per_page: z.number(),
  last_page: z.number(),
});

type ExternalTransferAccount = z.infer<typeof externalTransferAccountSchema>;

export { externalTransferAccountsSchema, type ExternalTransferAccount };
