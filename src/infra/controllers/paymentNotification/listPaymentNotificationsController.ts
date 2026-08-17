import type { ListPaymentNotificationsUseCase } from "~/app/useCases/paymentNotification/listPaymentNotificationsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListPaymentNotificationsController {
  constructor(private useCase: ListPaymentNotificationsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId, paymentId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");
    if (!paymentId) throw HttpAdapter.badRequest("paymentId is required");

    return await this.useCase.execute({
      accountUuid: campaignId,
      paymentUuid: paymentId,
    });
  }
}

export { ListPaymentNotificationsController };
