import type { ListWhatsappTemplatesUseCase } from "~/app/useCases/whatsappTemplates/listWhatsappTemplatesUseCase";
import type { RouteDTO } from "~/main/types/route";

class ListWhatsappTemplatesController {
  constructor(private listWhatsappTemplatesUseCase: ListWhatsappTemplatesUseCase) {}

  async handle(route: RouteDTO) {
    const notificationType = route.query.notification_type;
    const templates = await this.listWhatsappTemplatesUseCase.execute({ notificationType });
    return templates.map((t) => t.toJson());
  }
}

export { ListWhatsappTemplatesController };
