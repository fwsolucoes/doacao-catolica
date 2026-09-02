import type { DeleteWhatsappTemplateButtonUseCase } from "~/app/useCases/whatsappTemplates/deleteWhatsappTemplateButtonUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { deleteWhatsappTemplateButtonSchema } from "~/infra/schemas/internal/whatsappTemplateButtonDelete";
import type { RouteDTO } from "~/main/types/route";

class DeleteWhatsappTemplateButtonController {
  constructor(private deleteWhatsappTemplateButtonUseCase: DeleteWhatsappTemplateButtonUseCase) {}

  async handle(route: RouteDTO) {
    const { templateId } = route.params;
    if (!templateId) throw HttpAdapter.badRequest("templateId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(deleteWhatsappTemplateButtonSchema).validate(body);

    await this.deleteWhatsappTemplateButtonUseCase.execute(templateId, validated.button_uuid);

    return {
      toast: {
        message: "Botão removido com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { DeleteWhatsappTemplateButtonController };
