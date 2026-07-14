import type {
  CreateSubscriptionInput,
  SubscriptionGatewayDTO,
  UpdateSubscriptionInput,
} from "~/domain/gateways/subscription";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { createSubscriptionResponseSchema } from "../schemas/external/createSubscription";
import { formatDate } from "@arkyn/shared";

function cleanCpf(cpf?: string) {
  return cpf ? cpf.replace(/\D/g, "") : undefined;
}

function formatPhone(phone?: string) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("55") ? `+${digits}` : `+55${digits}`;
}

class SubscriptionGateway implements SubscriptionGatewayDTO {
  async createSubscription(input: CreateSubscriptionInput): Promise<string> {
    const headers = { "api-key": environmentVariables.API_KEY_DONATION };

    const body: Record<string, unknown> = {
      account_reference: input.accountReference,
      type: input.paymentType,
      registration_origin: "internal",
      create_payment: input.createPayment,
      print_bank_slip: false,
      category: input.category,
      active_notification: input.activeNotification,
      customer: {
        email: input.contactEmail,
        name: input.contactName,
        cpf_cnpj: cleanCpf(input.contactCpf),
        phone: formatPhone(input.contactPhone),
        birthdate: input.contactBirthDate
          ? formatDate([input.contactBirthDate], "brazilianDate", "YYYY-MM-DD")
          : undefined,
        reference: input.donorId,
      },
      name: input.description ?? `Recorrência - ${input.contactName}`,
      description: input.description ?? `Recorrência - ${input.contactName}`,
      amount: input.amount,
      recurrence_days: 30,
      pay_day: input.paymentDay,
      undetermined_amount: input.undeterminedAmount,
    };

    if (input.discount) {
      body.discount = {
        value: input.discount,
        due_date_limit_days: 0,
        type: "fixed",
      };
    }
    if (input.interest) {
      body.interest = { value: input.interest };
    }
    if (input.fineValue && input.fineType) {
      body.fine = { value: input.fineValue, type: input.fineType };
    }

    const apiResponse = await donationApi.post("/api/subscriptions", {
      body,
      headers,
    });

    if (!apiResponse.success && apiResponse.status === 400) {
      const uuid = (apiResponse.response as any)?.data?.uuid as
        | string
        | undefined;
      if (!uuid) throw HttpAdapter.badGateway(apiResponse.message);

      const { account_reference, create_payment, ...updateBody } = body as {
        account_reference: unknown;
        create_payment: unknown;
        [key: string]: unknown;
      };

      const putResponse = await donationApi.put(`/api/subscriptions/${uuid}`, {
        body: updateBody,
        headers,
      });
      if (!putResponse.success)
        throw HttpAdapter.badGateway(putResponse.message);

      return uuid;
    }

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      createSubscriptionResponseSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return data.data.uuid;
  }

  async updateSubscription(input: UpdateSubscriptionInput): Promise<void> {
    const headers = { "api-key": environmentVariables.API_KEY_DONATION };
    const url = `/api/subscriptions/${input.paymentPublicId}`;

    const body: Record<string, unknown> = {
      type: input.type,
      registration_origin: "external",
      description: input.description,
      amount: input.amount,
      pay_day: input.payDay,
      active_notification: input.activeNotification,
      perpetuate_payments_change: input.perpetuatePaymentsChange,
      undetermined_amount: input.undeterminedAmount,
    };

    if (input.discount) {
      body.discount = { value: input.discount, due_date_limit_days: 0, type: "fixed" };
    }
    if (input.interest) {
      body.interest = { value: input.interest };
    }
    if (input.fineValue && input.fineType) {
      body.fine = { value: input.fineValue, type: input.fineType };
    }

    const apiResponse = await donationApi.put(url, { body, headers });
    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { SubscriptionGateway };
