import type { LinkAmbassadorUseCase } from "~/app/useCases/linkAmbassador/linkAmbassadorUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { linkAmbassadorSchema } from "~/infra/schemas/internal/recurrence";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class LinkAmbassadorController {
  constructor(private linkAmbassadorUseCase: LinkAmbassadorUseCase) {}

  async handle(route: RouteDTO): Promise<void> {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const schemaValidator = new SchemaValidatorAdapter(linkAmbassadorSchema);
    const validatedBody = schemaValidator.validate(body);

    await this.linkAmbassadorUseCase.execute({
      subscriptionUuid: validatedBody.subscriptionUuid,
      affiliateReference: validatedBody.affiliateReference,
    });
  }
}

export { LinkAmbassadorController };
