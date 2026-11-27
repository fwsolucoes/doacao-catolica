import type { UpdateAccountWebhookUseCase } from "~/app/useCases/accountWebhook/updateAccountWebhookUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { toggleAccountWebhookSchema } from "~/infra/schemas/internal/accountWebhook";
import type { RouteDTO } from "~/main/types/route";

class ToggleAccountWebhookController {
  constructor(private updateAccountWebhookUseCase: UpdateAccountWebhookUseCase) {}

  async handle(route: RouteDTO) {
    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const { id, active } = new SchemaValidatorAdapter(
      toggleAccountWebhookSchema,
    ).validate(body);

    // a API aceita só `active` para ativar/desativar
    await this.updateAccountWebhookUseCase.execute({ webhookId: id, active });

    return {
      toast: {
        message: active ? "Webhook ativado." : "Webhook desativado.",
        type: "success" as const,
      },
    };
  }
}

export { ToggleAccountWebhookController };
