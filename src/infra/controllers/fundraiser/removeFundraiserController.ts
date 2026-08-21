import type { RemoveFundraiserUseCase } from "~/app/useCases/fundraiser/removeFundraiserUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { removeFundraiserSchema } from "~/infra/schemas/internal/fundraiser";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class RemoveFundraiserController {
  constructor(private removeFundraiserUseCase: RemoveFundraiserUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(removeFundraiserSchema).validate(body);

    await this.removeFundraiserUseCase.execute(validated.Id, user.token);

    return {
      toast: {
        message: "Arrecadador removido com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { RemoveFundraiserController };
