import type { CreateEmailTemplateUseCase } from "~/app/useCases/campaign/createEmailTemplateUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createEmailTemplateSchema } from "~/infra/schemas/internal/emailTemplate";
import type { RouteDTO } from "~/main/types/route";

const SUCCESS_TOAST = { message: "Layout criado com sucesso!", type: "success" as const };

class CreateEmailTemplateController {
  constructor(private createEmailTemplateUseCase: CreateEmailTemplateUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      createEmailTemplateSchema,
    ).validate(body);

    await this.createEmailTemplateUseCase.execute({ campaignId, data: validated });

    return { toast: SUCCESS_TOAST };
  }
}

export { CreateEmailTemplateController };
