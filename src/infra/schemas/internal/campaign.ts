import z from "zod";
import { paginationSchema } from "./pagination";

import { validateCpf, validatePhone } from "@arkyn/server";

const listCampaignsSchema = paginationSchema;

type CreateCampaignType = z.infer<typeof createCampaignSchema>;
type UpdateCampaignType = z.infer<typeof updateCampaignSchema>;
type DeleteCampaignType = z.infer<typeof deleteCampaignSchema>;

const createCampaignSchema = z.object({
  organizationId: z.uuid("ID da organização inválido"),
  name: z.string().min(1, "Nome é obrigatório"),
  avatar: z.string().optional(),
  document: z
    .string()
    .min(1, "Documento é obrigatório")
    .refine(validateCpf, "CPF inválido"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z
    .string()
    .min(1, "Sexo é obrigatório")
    .transform((value) => value.toUpperCase()),
  maritalStatus: z
    .string()
    .min(1, "Estado civil é obrigatório")
    .transform((value) => value.toUpperCase()),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine(validatePhone, "Telefone inválido"),
  whatsapp: z
    .string()
    .min(1, "WhatsApp é obrigatório")
    .refine(validatePhone, "WhatsApp inválido"),
  email: z.email("Email inválido"),
  street: z.string().min(1, "Rua é obrigatória"),
  streetNumber: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  country: z.string().min(1, "País é obrigatório"),
  postalCode: z.string().min(1, "CEP é obrigatório"),
  observations: z.string().optional(),
});

const updateCampaignSchema = z.object({
  id: z.uuid("ID do paciente inválido"),
  name: z.string().min(1, "Nome é obrigatório"),
  avatar: z.string().optional(),
  document: z
    .string()
    .min(1, "Documento é obrigatório")
    .refine(validateCpf, "CPF inválido"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z
    .string()
    .min(1, "Sexo é obrigatório")
    .transform((value) => value.toUpperCase()),
  maritalStatus: z
    .string()
    .min(1, "Estado civil é obrigatório")
    .transform((value) => value.toUpperCase()),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine(validatePhone, "Telefone inválido"),
  whatsapp: z
    .string()
    .min(1, "WhatsApp é obrigatório")
    .refine(validatePhone, "WhatsApp inválido"),
  email: z.email("Email inválido"),
  street: z.string().min(1, "Rua é obrigatória"),
  streetNumber: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  country: z.string().min(1, "País é obrigatório"),
  postalCode: z.string().min(1, "CEP é obrigatório"),
  observations: z.string().optional(),
});

const deleteCampaignSchema = z.object({
  id: z.uuid("ID do paciente inválido"),
});
const updateCampaignGeneralInfoSchema = z.object({
  name: z.string().min(3, "Mínimo de 3 caracteres"),
  slug: z.string().min(1, "Slug é obrigatório"),
  // known values: "active" | "inactive"
  status: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  phone: z.string().optional(),
  published: z.string(),
  typeDonation: z.string().min(1, "Campo obrigatório"),
  totalGoal: z.string().optional(),
  monthlyGoal: z.string().optional(),
  institutionName: z.string().optional(),
  cnpj: z.string().optional(),
  address: z.string().optional(),
});

type UpdateCampaignGeneralInfoType = z.infer<typeof updateCampaignGeneralInfoSchema>;

export {
  createCampaignSchema,
  deleteCampaignSchema,
  listCampaignsSchema,
  updateCampaignSchema,
  updateCampaignGeneralInfoSchema,
  type CreateCampaignType,
  type DeleteCampaignType,
  type UpdateCampaignType,
  type UpdateCampaignGeneralInfoType,
};
