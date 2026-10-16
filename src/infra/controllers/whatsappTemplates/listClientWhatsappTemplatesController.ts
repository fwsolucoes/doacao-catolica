import type { ListClientWhatsappTemplatesUseCase } from "~/app/useCases/whatsappTemplates/listClientWhatsappTemplatesUseCase";
import type { RouteDTO } from "~/main/types/route";

class ListClientWhatsappTemplatesController {
  constructor(private listClientWhatsappTemplatesUseCase: ListClientWhatsappTemplatesUseCase) {}

  async handle(route: RouteDTO) {
    const notificationType = route.query.notification_type;
    const templateType = route.query.template_type;
    const templates = await this.listClientWhatsappTemplatesUseCase.execute({
      notificationType,
      templateType,
    });
    return templates.map((t) => t.toJson());
  }
}

export { ListClientWhatsappTemplatesController };
