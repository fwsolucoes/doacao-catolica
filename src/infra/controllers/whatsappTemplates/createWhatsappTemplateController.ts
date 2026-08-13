import type { CreateWhatsappTemplateUseCase } from "~/app/useCases/whatsappTemplates/createWhatsappTemplateUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createWhatsappTemplateSchema } from "~/infra/schemas/internal/whatsappTemplate";
import type { RouteDTO } from "~/main/types/route";

class CreateWhatsappTemplateController {
  constructor(private createWhatsappTemplateUseCase: CreateWhatsappTemplateUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(createWhatsappTemplateSchema).validate(body);

    await this.createWhatsappTemplateUseCase.execute(validated);

    return {
      toast: {
        message: "Template criado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CreateWhatsappTemplateController };
