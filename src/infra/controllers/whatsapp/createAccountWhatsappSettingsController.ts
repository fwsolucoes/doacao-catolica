import type { CreateAccountWhatsappSettingsUseCase } from "~/app/useCases/whatsapp/createAccountWhatsappSettingsUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateAccountWhatsappSettingsSchema } from "~/infra/schemas/internal/whatsappConnection";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class CreateAccountWhatsappSettingsController {
  constructor(private useCase: CreateAccountWhatsappSettingsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      updateAccountWhatsappSettingsSchema,
    ).validate(body);

    return await this.useCase.execute(validated);
  }
}

export { CreateAccountWhatsappSettingsController };
