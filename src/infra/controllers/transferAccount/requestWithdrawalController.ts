import type { RequestWithdrawalUseCase } from "~/app/useCases/transferAccount/requestWithdrawalUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { requestWithdrawalBodySchema } from "~/infra/schemas/internal/transferAccount";
import type { RouteDTO } from "~/main/types/route";

class RequestWithdrawalController {
  constructor(private requestWithdrawalUseCase: RequestWithdrawalUseCase) {}

  async handle(route: RouteDTO) {
    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      requestWithdrawalBodySchema,
    ).validate(body);

    await this.requestWithdrawalUseCase.execute({
      accountUuid: validated.account_uuid,
      amount: validated.amount,
      pix: {
        key: validated.pix_key,
        type: validated.pix_type,
        scheduleDate: validated.schedule_date,
      },
    });

    return {
      toast: {
        message: "Saque solicitado com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { RequestWithdrawalController };
