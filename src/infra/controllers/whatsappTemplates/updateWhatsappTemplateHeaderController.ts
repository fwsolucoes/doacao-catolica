import type { UpdateWhatsappTemplateHeaderUseCase } from "~/app/useCases/whatsappTemplates/updateWhatsappTemplateHeaderUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateWhatsappTemplateHeaderSchema } from "~/infra/schemas/internal/whatsappTemplateHeaderUpdate";
import type { RouteDTO } from "~/main/types/route";

class UpdateWhatsappTemplateHeaderController {
  constructor(private updateWhatsappTemplateHeaderUseCase: UpdateWhatsappTemplateHeaderUseCase) {}

  async handle(route: RouteDTO) {
    const { templateId } = route.params;
    if (!templateId) throw HttpAdapter.badRequest("templateId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(updateWhatsappTemplateHeaderSchema).validate(body);

    await this.updateWhatsappTemplateHeaderUseCase.execute(
      templateId,
      validated.header_uuid,
      validated,
    );

    return {
      toast: {
        message: "Cabeçalho salvo com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateWhatsappTemplateHeaderController };
