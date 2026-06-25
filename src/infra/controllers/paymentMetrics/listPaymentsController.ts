import type { ListPaymentsUseCase } from "~/app/useCases/paymentMetrics/listPaymentsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListPaymentsController {
  constructor(private listPaymentsUseCase: ListPaymentsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.listPaymentsUseCase.execute({
      campaignPublicId: campaignId,
      page,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
      dateType: route.query.date_type,
      origin: route.query.origin,
      paymentType: route.query.type,
      status: route.query.status,
      notifiedEmail: route.query.notified_email,
      notifiedWhatsapp: route.query.notified_whatsapp,
    });
  }
}

export { ListPaymentsController };
