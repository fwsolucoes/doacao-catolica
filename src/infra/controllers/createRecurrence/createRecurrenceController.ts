import { z } from "zod";
import type { CreateRecurrenceUseCase } from "~/app/useCases/createRecurrence/createRecurrenceUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createRecurrenceSchema } from "~/infra/schemas/internal/recurrence";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class CreateRecurrenceController {
  constructor(private createRecurrenceUseCase: CreateRecurrenceUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);

    const schemaValidator = new SchemaValidatorAdapter(createRecurrenceSchema);
    const validatedBody = schemaValidator.validate(body);

    const undeterminedAmount = validatedBody.valueType === "undetermined";
    const amount = undeterminedAmount ? 0 : (validatedBody.amount ?? 0);

    await this.createRecurrenceUseCase.execute({
      contactId: validatedBody.contactId,
      contactName: validatedBody.contactName,
      contactEmail: validatedBody.contactEmail,
      contactPhone: validatedBody.contactPhone,
      contactCpf: validatedBody.contactCpf,
      contactBirthDate: validatedBody.contactBirthDate,
      accountId: validatedBody.accountId,
      campaignId,
      category: validatedBody.category,
      token: user.token,
      paymentDay: validatedBody.paymentDay,
      paymentType: validatedBody.paymentType,
      amount,
      undeterminedAmount,
      currentMonthPayment: validatedBody.currentMonthPayment,
      activeNotification: validatedBody.activeNotification,
      description: validatedBody.description,
      discount: validatedBody.discount,
      interest: validatedBody.interest,
      fineType: validatedBody.fineType,
      fineValue: validatedBody.fineValue,
    });
  }
}

export { CreateRecurrenceController };
