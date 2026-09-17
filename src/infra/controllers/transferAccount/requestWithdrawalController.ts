import type { RequestWithdrawalUseCase } from "~/app/useCases/transferAccount/requestWithdrawalUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { requestWithdrawalBodySchema } from "~/infra/schemas/internal/transferAccount";
import type { RouteDTO } from "~/main/types/route";

function getScheduleDate(): string {
  const now = new Date();
  const target = now.getHours() < 18 ? now : new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return target.toISOString().split("T")[0] as string;
}

class RequestWithdrawalController {
  constructor(private requestWithdrawalUseCase: RequestWithdrawalUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("Campaign ID is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      requestWithdrawalBodySchema,
    ).validate(body);

    await this.requestWithdrawalUseCase.execute({
      accountUuid: campaignId,
      amount: validated.amount,
      pix: {
        key: validated.pixKey,
        type: validated.pixType,
        scheduleDate: getScheduleDate(),
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
