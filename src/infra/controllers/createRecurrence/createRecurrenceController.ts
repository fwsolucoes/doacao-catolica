import { z } from "zod";
import type { CreateRecurrenceUseCase } from "~/app/useCases/createRecurrence/createRecurrenceUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

const createRecurrenceSchema = z.object({
  contactId: z.string().min(1),
  contactName: z.string().min(1),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  contactCpf: z.string().optional(),
  contactBirthDate: z.string().optional(),
  accountId: z.coerce.number(),
  category: z.enum(["donation", "tithe"]),
  paymentDay: z.coerce.number().int().min(1).max(31),
  paymentType: z.enum(["pix", "bank_slip"]),
  valueType: z.enum(["fixed", "undetermined"]),
  amount: z.coerce.number().optional(),
  currentMonthPayment: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  activeNotification: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  description: z.string().optional(),
  discount: z.coerce.number().optional(),
  interest: z.coerce.number().optional(),
  fineType: z.enum(["fixed", "percentage"]).optional(),
  fineValue: z.coerce.number().optional(),
});

class CreateRecurrenceController {
  constructor(private createRecurrenceUseCase: CreateRecurrenceUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const formData = await route.request.formData();
    const raw = Object.fromEntries(formData.entries());

    const parsed = createRecurrenceSchema.safeParse(raw);
    if (!parsed.success) {
      throw HttpAdapter.badRequest(
        parsed.error.issues.map((e) => e.message).join(", "),
      );
    }

    const data = parsed.data;
    const undeterminedAmount = data.valueType === "undetermined";
    const amount = undeterminedAmount ? 0 : (data.amount ?? 0);

    await this.createRecurrenceUseCase.execute({
      contactId: data.contactId,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      contactCpf: data.contactCpf,
      contactBirthDate: data.contactBirthDate,
      accountId: data.accountId,
      campaignId,
      category: data.category,
      token: user.token,
      paymentDay: data.paymentDay,
      paymentType: data.paymentType,
      amount,
      undeterminedAmount,
      currentMonthPayment: data.currentMonthPayment,
      activeNotification: data.activeNotification,
      description: data.description,
      discount: data.discount,
      interest: data.interest,
      fineType: data.fineType,
      fineValue: data.fineValue,
    });
  }
}

export { CreateRecurrenceController };
