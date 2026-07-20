import type { UpdateCampaignGeneralInfoUseCase } from "~/app/useCases/campaign/updateCampaignGeneralInfoUseCase";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { updateCampaignGeneralInfoSchema } from "~/infra/schemas/internal/campaign";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class UpdateCampaignGeneralInfoController {
  constructor(
    private updateCampaignGeneralInfoUseCase: UpdateCampaignGeneralInfoUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const body = await DecodeRequestBodyAdapter.decode(route.request);
    const validated = new SchemaValidatorAdapter(
      updateCampaignGeneralInfoSchema,
    ).validate(body);

    const startDate = validated.startDate || null;
    const endDate = validated.endDate || null;
    const totalGoal = validated.totalGoal ? parseFloat(validated.totalGoal) : null;
    const monthlyGoal = validated.monthlyGoal
      ? parseFloat(validated.monthlyGoal)
      : null;

    return await this.updateCampaignGeneralInfoUseCase.execute({
      campaignId,
      token: user.token,
      name: validated.name,
      slug: validated.slug,
      status: validated.status === "active",
      published: validated.published === "true",
      startDate,
      endDate,
      phone: validated.phone || null,
      typeDonation: validated.typeDonation,
      totalGoal,
      monthlyGoal,
      institutionName: validated.institutionName || null,
      cnpj: validated.cnpj || null,
      address: validated.address || null,
    });
  }
}

export { UpdateCampaignGeneralInfoController };
