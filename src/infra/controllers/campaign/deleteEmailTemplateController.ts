import type { DeleteEmailTemplateUseCase } from "~/app/useCases/campaign/deleteEmailTemplateUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { deleteEmailTemplateSchema } from "~/infra/schemas/internal/emailTemplate";
import type { RouteDTO } from "~/main/types/route";

const SUCCESS_TOAST = { message: "Layout excluído com sucesso!", type: "success" as const };

class DeleteEmailTemplateController {
  constructor(private deleteEmailTemplateUseCase: DeleteEmailTemplateUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      deleteEmailTemplateSchema,
    ).validate(body);

    await this.deleteEmailTemplateUseCase.execute({
      campaignId,
      type: validated.type,
    });

    return { toast: SUCCESS_TOAST };
  }
}

export { DeleteEmailTemplateController };
