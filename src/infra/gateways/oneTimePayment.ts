import { formatDate } from "@arkyn/shared";
import type {
  CreateOneTimePaymentInput,
  OneTimePaymentGatewayDTO,
} from "~/domain/gateways/oneTimePayment";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { createOneTimePaymentResponseSchema } from "../schemas/external/createOneTimePayment";

function cleanCpf(cpf?: string) {
  return cpf ? cpf.replace(/\D/g, "") : undefined;
}

function formatPhone(phone?: string) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("55") ? `+${digits}` : `+55${digits}`;
}

class OneTimePaymentGateway implements OneTimePaymentGatewayDTO {
  async createOneTimePayment(input: CreateOneTimePaymentInput): Promise<string> {
    const headers = { "api-key": environmentVariables.API_KEY_DONATION };

    const body = {
      amount: input.amount,
      type: input.paymentType,
      category: input.category,
      account_reference: input.accountReference,
      customer: {
        email: input.contactEmail,
        name: input.contactName,
        cpf_cnpj: cleanCpf(input.contactCpf),
        phone: formatPhone(input.contactPhone),
        birthdate: input.contactBirthDate
          ? formatDate([input.contactBirthDate], "brazilianDate", "YYYY-MM-DD")
          : undefined,
        reference: input.donorId,
        international: false,
      },
    };

    const apiResponse = await donationApi.post("/api/transfers", {
      body,
      headers,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      createOneTimePaymentResponseSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return data.data.payment_uuid;
  }
}

export { OneTimePaymentGateway };
