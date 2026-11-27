import type { UpdateAccountWebhookUseCase } from "~/app/useCases/accountWebhook/updateAccountWebhookUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateAccountWebhookSchema } from "~/infra/schemas/internal/accountWebhook";
import type { RouteDTO } from "~/main/types/route";

class UpdateAccountWebhookController {
  constructor(private updateAccountWebhookUseCase: UpdateAccountWebhookUseCase) {}

  async handle(route: RouteDTO) {
    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const { id, ...validated } = new SchemaValidatorAdapter(
      updateAccountWebhookSchema,
    ).validate(body);

    await this.updateAccountWebhookUseCase.execute({ webhookId: id, ...validated });

    return {
      toast: {
        message: "Webhook atualizado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateAccountWebhookController };
