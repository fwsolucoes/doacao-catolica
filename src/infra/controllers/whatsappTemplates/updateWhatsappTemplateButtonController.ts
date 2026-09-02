import type { UpdateWhatsappTemplateButtonUseCase } from "~/app/useCases/whatsappTemplates/updateWhatsappTemplateButtonUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateWhatsappTemplateButtonSchema } from "~/infra/schemas/internal/whatsappTemplateButtonUpdate";
import type { RouteDTO } from "~/main/types/route";

class UpdateWhatsappTemplateButtonController {
  constructor(private updateWhatsappTemplateButtonUseCase: UpdateWhatsappTemplateButtonUseCase) {}

  async handle(route: RouteDTO) {
    const { templateId } = route.params;
    if (!templateId) throw HttpAdapter.badRequest("templateId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(updateWhatsappTemplateButtonSchema).validate(body);

    await this.updateWhatsappTemplateButtonUseCase.execute(
      templateId,
      validated.button.uuid,
      validated,
    );

    return {
      toast: {
        message: "Botão salvo com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateWhatsappTemplateButtonController };
