import z from "zod";

const createCampaignSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  typeDonation: z.string().min(1, "Tipo de doação é obrigatório"),
  status: z.string().transform((v) => v === "active"),
  published: z.string().transform((v) => v === "true"),
  startDate: z.string().optional().transform((v) => v || null),
  endDate: z.string().optional().transform((v) => v || null),
  phone: z.string().optional().transform((v) => v || null),
  cnpj: z.string().min(1, "CPF/CNPJ é obrigatório"),
  institutionName: z.string().optional().transform((v) => v || null),
  image: z.string().optional().transform((v) => v || null),
  institutionCep: z.string().optional().transform((v) => v || null),
  institutionStreet: z.string().optional().transform((v) => v || null),
  institutionNumber: z.string().optional().transform((v) => v || null),
  institutionComplement: z.string().optional().transform((v) => v || null),
  institutionNeighborhood: z.string().optional().transform((v) => v || null),
  institutionCity: z.string().optional().transform((v) => v || null),
  institutionState: z.string().optional().transform((v) => v || null),
  featuredImage: z.string().optional().transform((v) => v || null),
  imageMobile: z.string().optional().transform((v) => v || null),
  headerImage: z.string().optional().transform((v) => v || null),
  videoUrl: z.string().optional().transform((v) => v || null),
  description: z.string().optional().transform((v) => v || null),
  category: z.string().optional().transform((v) => v || null),
  title: z.string().optional().transform((v) => v || null),
  whyDonateTitle: z.string().optional().transform((v) => v || null),
  whyDonateText: z.string().optional().transform((v) => v || null),
  whyDonateImage: z.string().optional().transform((v) => v || null),
  aboutTitle: z.string().optional().transform((v) => v || null),
  aboutText: z.string().optional().transform((v) => v || null),
  aboutImage: z.string().optional().transform((v) => v || null),
  supportWhatsapp: z.string().optional().transform((v) => v || null),
  supportEmail: z.string().optional().transform((v) => v || null),
  pix: z.string().optional().transform((v) => v !== "false"),
  boleto: z.string().optional().transform((v) => v !== "false"),
  creditCard: z.string().optional().transform((v) => v !== "false"),
  minDonationAmount: z.string().optional().transform((v) => (v ? parseFloat(v) : null)),
  totalGoal: z.string().optional().transform((v) => (v ? parseFloat(v) : null)),
  monthlyGoal: z.string().optional().transform((v) => (v ? parseFloat(v) : null)),
  showProgressBar: z.string().optional().transform((v) => v === "true"),
  progressBase: z.string().optional().transform((v) => v || null),
});
const updateCampaignGeneralInfoSchema = z.object({
  name: z.string().min(3, "Mínimo de 3 caracteres"),
  slug: z.string().min(1, "Slug é obrigatório"),
  // known values: "active" | "inactive"
  status: z.string().transform((v) => v === "active"),
  published: z.string().transform((v) => v === "true"),
  typeDonation: z.string().min(1, "Campo obrigatório"),
  startDate: z.string().optional().transform((v) => v || null),
  endDate: z.string().optional().transform((v) => v || null),
  phone: z.string().optional().transform((v) => v || null),
  totalGoal: z.string().optional().transform((v) => (v ? parseFloat(v) : null)),
  monthlyGoal: z.string().optional().transform((v) => (v ? parseFloat(v) : null)),
  institutionName: z.string().optional().transform((v) => v || null),
  cnpj: z.string().min(1, "CPF/CNPJ é obrigatório"),
  address: z.string().optional().transform((v) => v || null),
});

type CreateCampaignType = z.infer<typeof createCampaignSchema>;
type UpdateCampaignGeneralInfoType = z.infer<typeof updateCampaignGeneralInfoSchema>;

const updateCampaignPageSchema = z.object({
  title: z.string().optional().transform((v) => v || null),
  description: z.string().optional().transform((v) => v || null),
  featuredImage: z.string().optional().transform((v) => v || null),
  imageMobile: z.string().optional().transform((v) => v || null),
  videoUrl: z.string().optional().transform((v) => v || null),
  headerImage: z.string().optional().transform((v) => v || null),
  whyDonateTitle: z.string().optional().transform((v) => v || null),
  whyDonateText: z.string().optional().transform((v) => v || null),
  whyDonateImage: z.string().optional().transform((v) => v || null),
  aboutTitle: z.string().optional().transform((v) => v || null),
  aboutText: z.string().optional().transform((v) => v || null),
  aboutImage: z.string().optional().transform((v) => v || null),
  supportWhatsapp: z.string().optional().transform((v) => v || null),
  supportEmail: z.string().optional().transform((v) => v || null),
});

type UpdateCampaignPageType = z.infer<typeof updateCampaignPageSchema>;

export {
  createCampaignSchema,
  updateCampaignGeneralInfoSchema,
  updateCampaignPageSchema,
  type CreateCampaignType,
  type UpdateCampaignGeneralInfoType,
  type UpdateCampaignPageType,
};
