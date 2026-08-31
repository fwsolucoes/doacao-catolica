import type { GetWhatsappTemplateUseCase } from "~/app/useCases/whatsappTemplates/getWhatsappTemplateUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetWhatsappTemplateController {
  constructor(private getWhatsappTemplateUseCase: GetWhatsappTemplateUseCase) {}

  async handle(route: RouteDTO) {
    const { templateId } = route.params;
    if (!templateId) throw HttpAdapter.badRequest("templateId is required");

    const template = await this.getWhatsappTemplateUseCase.execute(templateId);
    return template.toJson();
  }
}

export { GetWhatsappTemplateController };
