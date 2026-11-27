import { z } from "zod";

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const url = z
  .string()
  .trim()
  .min(1, "Informe a URL do endpoint")
  .refine(isHttpsUrl, "Informe uma URL válida iniciada por https://");

// Os checkboxes alimentam um único hidden input com os eventos separados por vírgula
// (o decode do body não preserva chaves repetidas). "*" = todos, inclusive futuros.
const events = z
  .string()
  .optional()
  .transform((v) => (v ? v.split(",").filter(Boolean) : []))
  .refine((v) => v.length > 0, "Selecione ao menos um evento");

const id = z.uuid({ message: "Webhook inválido" });

const createAccountWebhookSchema = z.object({ url, events });

const updateAccountWebhookSchema = z.object({ id, url, events });

const toggleAccountWebhookSchema = z.object({
  id,
  active: z.string().transform((v) => v === "true"),
});

const deleteAccountWebhookSchema = z.object({ id });

export {
  createAccountWebhookSchema,
  deleteAccountWebhookSchema,
  toggleAccountWebhookSchema,
  updateAccountWebhookSchema,
};
