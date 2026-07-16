import type { CreateTransferAccountUseCase } from "~/app/useCases/transferAccount/createTransferAccountUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { createTransferAccountBodySchema } from "~/infra/schemas/internal/transferAccount";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class CreateTransferAccountController {
  constructor(
    private createTransferAccountUseCase: CreateTransferAccountUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);

    if (!user) throw HttpAdapter.unauthorized("Unauthorized");
    if (!user.accountId) throw HttpAdapter.badRequest("account_id is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      createTransferAccountBodySchema,
    ).validate(body);

    await this.createTransferAccountUseCase.execute(
      {
        accountId: user.accountId,
        pixType: validated.pixType,
        pixKey: validated.pixKey,
        type: validated.type,
      },
      user.token,
    );

    return {
      toast: {
        message: "Conta de transferência criada com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CreateTransferAccountController };
