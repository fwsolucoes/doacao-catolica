import type { ListWhatsappTemplatesUseCase } from "~/app/useCases/whatsappTemplates/listWhatsappTemplatesUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListWhatsappTemplatesController {
  constructor(private listWhatsappTemplatesUseCase: ListWhatsappTemplatesUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const notificationType = route.query.notification_type;
    const templateType = route.query.template_type;
    const templates = await this.listWhatsappTemplatesUseCase.execute({
      campaignId,
      notificationType,
      templateType,
    });
    return templates.map((t) => t.toJson());
  }
}

export { ListWhatsappTemplatesController };
