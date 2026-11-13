import type { CreateRaffleUseCase } from "~/app/useCases/raffle/createRaffleUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createRaffleSchema } from "~/infra/schemas/internal/raffle";
import type { RouteDTO } from "~/main/types/route";

class CreateRaffleController {
  constructor(private createRaffleUseCase: CreateRaffleUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(createRaffleSchema).validate(body);

    await this.createRaffleUseCase.execute({
      accountReference: campaignId,
      ...validated,
    });

    return {
      toast: {
        message: "Sorteio criado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CreateRaffleController };
