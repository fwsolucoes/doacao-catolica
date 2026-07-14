import type { DisableRecurrenceUseCase } from "~/app/useCases/disableRecurrence/disableRecurrenceUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { disableRecurrenceSchema } from "~/infra/schemas/internal/recurrence";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class DisableRecurrenceController {
  constructor(private disableRecurrenceUseCase: DisableRecurrenceUseCase) {}

  async handle(route: RouteDTO): Promise<void> {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const schemaValidator = new SchemaValidatorAdapter(disableRecurrenceSchema);
    const validatedBody = schemaValidator.validate(body);

    await this.disableRecurrenceUseCase.execute({
      subscriptionUuid: validatedBody.subscriptionUuid,
      observation: validatedBody.observation,
      perpetuatePaymentsChange: validatedBody.perpetuatePaymentsChange,
      perpetuateNextPaymentsChange: validatedBody.perpetuateNextPaymentsChange,
      origin: user.email,
    });
  }
}

export { DisableRecurrenceController };
