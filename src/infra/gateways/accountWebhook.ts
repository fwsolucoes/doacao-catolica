import { AccountWebhook } from "~/domain/entities/accountWebhook";
import type {
  AccountWebhookGatewayDTO,
  AccountWebhookInput,
  UpdateAccountWebhookInput,
} from "~/domain/gateways/accountWebhook";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalAccountWebhooksSchema } from "../schemas/external/accountWebhook";

type ApiResponse = Awaited<ReturnType<typeof donationApi.get>>;

/**
 * 422 do Laravel: `{ message, errors: { url: [...], "events.0": [...] } }`.
 * Mapeia para os nomes dos campos do formulário para o erro aparecer no FormField.
 */
function toFieldErrors(response: unknown): Record<string, string> | undefined {
  const errors = (response as { errors?: Record<string, unknown> } | null)?.errors;
  if (!errors || typeof errors !== "object") return undefined;

  const fieldErrors: Record<string, string> = {};
  for (const [key, value] of Object.entries(errors)) {
    const message = Array.isArray(value) ? value[0] : value;
    if (typeof message !== "string") continue;
    const field = key.split(".")[0];
    if ((field === "url" || field === "events") && !fieldErrors[field]) {
      fieldErrors[field] = message;
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

function throwOnError(apiResponse: ApiResponse) {
  if (apiResponse.success) return;

  if (apiResponse.status === 404) throw HttpAdapter.notFound(apiResponse.message);

  if (apiResponse.status === 422) {
    throw HttpAdapter.unprocessableEntity({
      message: apiResponse.message,
      fieldErrors: toFieldErrors(apiResponse.response),
    });
  }

  throw HttpAdapter.badGateway(apiResponse.message);
}

function toExternalBody(input: UpdateAccountWebhookInput) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  );
}

class AccountWebhookGateway implements AccountWebhookGatewayDTO {
  private headers = { "api-key": environmentVariables.API_KEY_DONATION };

  async listAccountWebhooks(accountReference: string): Promise<AccountWebhook[]> {
    const apiResponse = await donationApi.get(
      `/api/account_webhooks/account/${accountReference}`,
      { headers: this.headers },
    );

    throwOnError(apiResponse);

    const { data } = new SchemaValidatorAdapter(
      externalAccountWebhooksSchema,
    ).validate(apiResponse.response);

    return data.map((item) =>
      AccountWebhook.restore({
        id: item.uuid,
        url: item.url,
        events: item.events,
        active: item.active,
      }),
    );
  }

  async createAccountWebhook(
    accountReference: string,
    input: AccountWebhookInput,
  ): Promise<void> {
    const apiResponse = await donationApi.post(
      `/api/account_webhooks/account/${accountReference}`,
      { body: toExternalBody({ ...input, active: true }), headers: this.headers },
    );

    throwOnError(apiResponse);
  }

  async updateAccountWebhook(
    webhookId: string,
    input: UpdateAccountWebhookInput,
  ): Promise<void> {
    const apiResponse = await donationApi.put(`/api/account_webhooks/${webhookId}`, {
      body: toExternalBody(input),
      headers: this.headers,
    });

    throwOnError(apiResponse);
  }

  async deleteAccountWebhook(webhookId: string): Promise<void> {
    const apiResponse = await donationApi.delete(
      `/api/account_webhooks/${webhookId}`,
      { headers: this.headers },
    );

    throwOnError(apiResponse);
  }
}

export { AccountWebhookGateway };
