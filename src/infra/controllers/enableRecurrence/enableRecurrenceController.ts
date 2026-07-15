import type { EnableRecurrenceUseCase } from "~/app/useCases/enableRecurrence/enableRecurrenceUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { enableRecurrenceSchema } from "~/infra/schemas/internal/recurrence";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class EnableRecurrenceController {
  constructor(private enableRecurrenceUseCase: EnableRecurrenceUseCase) {}

  async handle(route: RouteDTO): Promise<void> {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const schemaValidator = new SchemaValidatorAdapter(enableRecurrenceSchema);
    const validatedBody = schemaValidator.validate(body);

    await this.enableRecurrenceUseCase.execute({
      subscriptionUuid: validatedBody.subscriptionUuid,
    });
  }
}

export { EnableRecurrenceController };
