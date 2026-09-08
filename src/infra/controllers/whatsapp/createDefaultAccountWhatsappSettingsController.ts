import type { CreateDefaultAccountWhatsappSettingsUseCase } from "~/app/useCases/whatsapp/createDefaultAccountWhatsappSettingsUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createDefaultAccountWhatsappSettingsSchema } from "~/infra/schemas/internal/whatsappConnection";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class CreateDefaultAccountWhatsappSettingsController {
  constructor(private useCase: CreateDefaultAccountWhatsappSettingsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      createDefaultAccountWhatsappSettingsSchema,
    ).validate(body);

    return await this.useCase.execute(validated.accountReference);
  }
}

export { CreateDefaultAccountWhatsappSettingsController };
