import type { DeleteWhatsappTemplateVariableUseCase } from "~/app/useCases/whatsappTemplates/deleteWhatsappTemplateVariableUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { deleteWhatsappTemplateVariableSchema } from "~/infra/schemas/internal/whatsappTemplateVariableDelete";
import type { RouteDTO } from "~/main/types/route";

class DeleteWhatsappTemplateVariableController {
  constructor(private useCase: DeleteWhatsappTemplateVariableUseCase) {}

  async handle(route: RouteDTO) {
    const { templateId } = route.params;
    if (!templateId) throw HttpAdapter.badRequest("templateId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(deleteWhatsappTemplateVariableSchema).validate(body);

    await this.useCase.execute(templateId, validated.variable_uuid);

    return {
      toast: {
        message: "Variável removida com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { DeleteWhatsappTemplateVariableController };
