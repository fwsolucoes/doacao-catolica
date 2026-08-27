import type { BulkWithdrawalUseCase } from "~/app/useCases/transferAccount/bulkWithdrawalUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { AuthService } from "~/infra/services/authService";
import { bulkWithdrawalBodySchema } from "~/infra/schemas/internal/transferAccount";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class BulkWithdrawalController {
  constructor(private bulkWithdrawalUseCase: BulkWithdrawalUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(bulkWithdrawalBodySchema).validate(body);

    await this.bulkWithdrawalUseCase.execute({
      referenceId: String(user.accountId),
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

export { BulkWithdrawalController };
