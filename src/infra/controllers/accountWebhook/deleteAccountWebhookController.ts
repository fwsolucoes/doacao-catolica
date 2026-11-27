import type { DeleteAccountWebhookUseCase } from "~/app/useCases/accountWebhook/deleteAccountWebhookUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { deleteAccountWebhookSchema } from "~/infra/schemas/internal/accountWebhook";
import type { RouteDTO } from "~/main/types/route";

class DeleteAccountWebhookController {
  constructor(private deleteAccountWebhookUseCase: DeleteAccountWebhookUseCase) {}

  async handle(route: RouteDTO) {
    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const { id } = new SchemaValidatorAdapter(deleteAccountWebhookSchema).validate(
      body,
    );

    await this.deleteAccountWebhookUseCase.execute(id);

    return {
      toast: {
        message: "Webhook excluído com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { DeleteAccountWebhookController };
