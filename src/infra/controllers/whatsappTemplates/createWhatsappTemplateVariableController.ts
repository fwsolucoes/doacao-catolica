import type { CreateWhatsappTemplateVariableUseCase } from "~/app/useCases/whatsappTemplates/createWhatsappTemplateVariableUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createWhatsappTemplateVariableSchema } from "~/infra/schemas/internal/whatsappTemplateVariableCreate";
import type { RouteDTO } from "~/main/types/route";

class CreateWhatsappTemplateVariableController {
  constructor(private useCase: CreateWhatsappTemplateVariableUseCase) {}

  async handle(route: RouteDTO) {
    const { templateId } = route.params;
    if (!templateId) throw HttpAdapter.badRequest("templateId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(createWhatsappTemplateVariableSchema).validate(body);

    await this.useCase.execute(templateId, validated);

    return {
      toast: {
        message: "Variável adicionada com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CreateWhatsappTemplateVariableController };
