import type { UpdateRaffleUseCase } from "~/app/useCases/raffle/updateRaffleUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateRaffleSchema } from "~/infra/schemas/internal/raffle";
import type { RouteDTO } from "~/main/types/route";

class UpdateRaffleController {
  constructor(private updateRaffleUseCase: UpdateRaffleUseCase) {}

  async handle(route: RouteDTO) {
    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const { id, ...validated } = new SchemaValidatorAdapter(
      updateRaffleSchema,
    ).validate(body);

    await this.updateRaffleUseCase.execute({ raffleId: id, ...validated });

    return {
      toast: {
        message: "Sorteio atualizado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateRaffleController };
