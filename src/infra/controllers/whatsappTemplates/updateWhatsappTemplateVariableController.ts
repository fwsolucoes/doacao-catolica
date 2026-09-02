import type { UpdateWhatsappTemplateVariableUseCase } from "~/app/useCases/whatsappTemplates/updateWhatsappTemplateVariableUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateWhatsappTemplateVariableSchema } from "~/infra/schemas/internal/whatsappTemplateVariableUpdate";
import type { RouteDTO } from "~/main/types/route";

class UpdateWhatsappTemplateVariableController {
  constructor(private useCase: UpdateWhatsappTemplateVariableUseCase) {}

  async handle(route: RouteDTO) {
    const { templateId } = route.params;
    if (!templateId) throw HttpAdapter.badRequest("templateId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(updateWhatsappTemplateVariableSchema).validate(body);

    await this.useCase.execute(templateId, validated.variable_uuid, validated);

    return {
      toast: {
        message: "Variável salva com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateWhatsappTemplateVariableController };
