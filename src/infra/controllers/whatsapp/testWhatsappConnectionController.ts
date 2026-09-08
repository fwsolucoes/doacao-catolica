import type { TestWhatsappConnectionUseCase } from "~/app/useCases/whatsapp/testWhatsappConnectionUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { testWhatsappConnectionSchema } from "~/infra/schemas/internal/whatsappConnection";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class TestWhatsappConnectionController {
  constructor(private useCase: TestWhatsappConnectionUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      testWhatsappConnectionSchema,
    ).validate(body);

    return await this.useCase.execute(validated.token);
  }
}

export { TestWhatsappConnectionController };
