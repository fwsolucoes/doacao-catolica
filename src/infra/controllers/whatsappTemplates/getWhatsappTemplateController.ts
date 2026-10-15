import type { GetWhatsappTemplateUseCase } from "~/app/useCases/whatsappTemplates/getWhatsappTemplateUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetWhatsappTemplateController {
  constructor(private getWhatsappTemplateUseCase: GetWhatsappTemplateUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId, templateId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");
    if (!templateId) throw HttpAdapter.badRequest("templateId is required");

    const template = await this.getWhatsappTemplateUseCase.execute(campaignId, templateId);
    return template.toJson();
  }
}

export { GetWhatsappTemplateController };
