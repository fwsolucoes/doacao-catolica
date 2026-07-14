import type { UpdateRecurrenceUseCase } from "~/app/useCases/updateRecurrence/updateRecurrenceUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateRecurrenceSchema } from "~/infra/schemas/internal/recurrence";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class UpdateRecurrenceController {
  constructor(private updateRecurrenceUseCase: UpdateRecurrenceUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const schemaValidator = new SchemaValidatorAdapter(updateRecurrenceSchema);
    const validatedBody = schemaValidator.validate(body);

    const undeterminedAmount = validatedBody.valueType === "undetermined";
    const amount = undeterminedAmount ? 0 : (validatedBody.amount ?? 0);

    await this.updateRecurrenceUseCase.execute({
      paymentPublicId: validatedBody.paymentId,
      payDay: validatedBody.payDay,
      type: validatedBody.type,
      amount,
      undeterminedAmount,
      description: validatedBody.description,
      activeNotification: validatedBody.activeNotification,
      perpetuatePaymentsChange: validatedBody.perpetuatePaymentsChange,
      discount: validatedBody.discount,
      interest: validatedBody.interest,
      fineType: validatedBody.fineType,
      fineValue: validatedBody.fineValue,
    });
  }
}

export { UpdateRecurrenceController };
