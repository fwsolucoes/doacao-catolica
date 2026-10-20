import type { CreateWhatsappTemplateButtonUseCase } from "~/app/useCases/whatsappTemplates/createWhatsappTemplateButtonUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createWhatsappTemplateButtonSchema } from "~/infra/schemas/internal/whatsappTemplateButtonCreate";
import type { RouteDTO } from "~/main/types/route";

class CreateWhatsappTemplateButtonController {
  constructor(private createWhatsappTemplateButtonUseCase: CreateWhatsappTemplateButtonUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId, templateId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");
    if (!templateId) throw HttpAdapter.badRequest("templateId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(createWhatsappTemplateButtonSchema).validate(body);

    await this.createWhatsappTemplateButtonUseCase.execute(campaignId, templateId, validated);

    return {
      toast: {
        message: "Botão adicionado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CreateWhatsappTemplateButtonController };
