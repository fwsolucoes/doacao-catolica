import type { ManualPaymentData, PaymentGatewayDTO } from "~/domain/gateways/payment";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { donationApi } from "../http/donationApi";

class PaymentGateway implements PaymentGatewayDTO {
  private get headers() {
    return { "api-key": environmentVariables.API_KEY_DONATION };
  }

  async cancelPayment(accountUuid: string, payments: string[]): Promise<void> {
    const apiResponse = await donationApi.delete(
      `/api/payments/delete/${accountUuid}`,
      { body: { payments }, headers: this.headers },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async sendReminderNotification(paymentUuid: string): Promise<string> {
    const apiResponse = await donationApi.post(
      `/api/notifications/instant-reminder/${paymentUuid}`,
      { body: {}, headers: this.headers },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    return apiResponse.response?.message ?? "Lembrete enviado com sucesso!";
  }

  async manualPayment(accountUuid: string, data: ManualPaymentData): Promise<void> {
    const body: Record<string, unknown> = {
      payment_uuid: data.paymentId,
      new_amount: data.amount,
      obs: data.observations || "baixa manual",
      paid_date: data.paymentDate + " 00:00:00",
      method_uuid: data.methodId,
    };

    if (data.bankAccount) body.bank_account = data.bankAccount;

    const apiResponse = await donationApi.post(
      `/api/payments/manual/${accountUuid}`,
      { body, headers: this.headers },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { PaymentGateway };
