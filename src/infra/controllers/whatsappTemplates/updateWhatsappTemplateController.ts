import type { UpdateWhatsappTemplateUseCase } from "~/app/useCases/whatsappTemplates/updateWhatsappTemplateUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateWhatsappTemplateSchema } from "~/infra/schemas/internal/whatsappTemplateUpdate";
import type { RouteDTO } from "~/main/types/route";

const ACTION_MESSAGES: Record<string, string> = {
  save_general: "Dados gerais salvos com sucesso!",
  save_header: "Cabeçalho salvo com sucesso!",
  save_button: "Botão salvo com sucesso!",
};

class UpdateWhatsappTemplateController {
  constructor(private updateWhatsappTemplateUseCase: UpdateWhatsappTemplateUseCase) {}

  async handle(route: RouteDTO) {
    const { templateId } = route.params;
    if (!templateId) throw HttpAdapter.badRequest("templateId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(updateWhatsappTemplateSchema).validate(body);

    await this.updateWhatsappTemplateUseCase.execute(templateId, validated);

    const message = ACTION_MESSAGES[validated._action] ?? "Template atualizado com sucesso!";

    return {
      toast: {
        message,
        type: "success" as const,
      },
    };
  }
}

export { UpdateWhatsappTemplateController };
