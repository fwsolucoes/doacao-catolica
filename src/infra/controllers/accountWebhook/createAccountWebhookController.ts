import type { CreateAccountWebhookUseCase } from "~/app/useCases/accountWebhook/createAccountWebhookUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createAccountWebhookSchema } from "~/infra/schemas/internal/accountWebhook";
import type { RouteDTO } from "~/main/types/route";

class CreateAccountWebhookController {
  constructor(private createAccountWebhookUseCase: CreateAccountWebhookUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(createAccountWebhookSchema).validate(
      body,
    );

    await this.createAccountWebhookUseCase.execute({
      accountReference: campaignId,
      ...validated,
    });

    return {
      toast: {
        message: "Webhook cadastrado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CreateAccountWebhookController };
