import type { UpdateEmailTemplateUseCase } from "~/app/useCases/campaign/updateEmailTemplateUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateEmailTemplateSchema } from "~/infra/schemas/internal/emailTemplate";
import type { RouteDTO } from "~/main/types/route";

const SUCCESS_TOAST = { message: "Layout atualizado com sucesso!", type: "success" as const };

class UpdateEmailTemplateController {
  constructor(private updateEmailTemplateUseCase: UpdateEmailTemplateUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      updateEmailTemplateSchema,
    ).validate(body);

    await this.updateEmailTemplateUseCase.execute({ campaignId, data: validated });

    return { toast: SUCCESS_TOAST };
  }
}

export { UpdateEmailTemplateController };
