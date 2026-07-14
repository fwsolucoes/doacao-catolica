import type {
  GeneratePaymentBookletInput,
  PaymentBookletGatewayDTO,
} from "~/domain/gateways/paymentBooklet";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { webworkerApi } from "../http/webworkerApi";
import { generatePaymentBookletResponseSchema } from "../schemas/external/paymentBooklet";

class PaymentBookletGateway implements PaymentBookletGatewayDTO {
  async generatePaymentBooklet(
    input: GeneratePaymentBookletInput,
  ): Promise<string> {
    const headers = { "api-key": environmentVariables.API_KEY_DONATION };

    const apiResponse = await webworkerApi.post("/generate-bulk-slips", {
      body: {
        subscription_id: input.subscriptionUuid,
        project_id: input.accountReference,
        start_date: input.startDate,
        end_date: input.endDate,
      },
      headers,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      generatePaymentBookletResponseSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return data.url;
  }
}

export { PaymentBookletGateway };
