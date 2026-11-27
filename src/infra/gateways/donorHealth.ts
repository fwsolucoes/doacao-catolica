import type { DonorHealthSearchParams } from "~/app/search/donorHealthSearchParams";
import { DonorHealth } from "~/domain/entities/donorHealth";
import type { DonorHealthGatewayDTO } from "~/domain/gateways/donorHealth";
import { donorHealthMonthsMock } from "~/lib/mocks/donorHealthMock";

class DonorHealthGateway implements DonorHealthGatewayDTO {
  /**
   * TODO: integrar com o webworker quando o contrato for confirmado:
   *   GET `${API_URL_WEBWORKER}/accounts/{accountId}/reports/donor-health?months=&lapse_months=`
   *   url += searchParams.toExternal(["page", "pageLimit"]);
   *   headers: { "X-Reports-Token": environmentVariables.REPORTS_API_TOKEN }
   *   → validar com o schema externo (infra/schemas/external/donorHealth.ts, a criar)
   *   → mapear para DonorHealth.restore({ windowMonths, lapseMonths, months }).
   * Hoje o webworker responde 503 "Token de relatorios nao configurado." (falta a variável no servidor),
   * então a tela usa os dados do Figma (os KPIs são calculados a partir da série mensal).
   */
  async getDonorHealth(
    _accountId: number,
    searchParams: DonorHealthSearchParams,
  ): Promise<DonorHealth> {
    const { months, lapse_months } = searchParams.filter ?? { months: 24, lapse_months: 6 };

    return DonorHealth.restore({
      windowMonths: months,
      lapseMonths: lapse_months,
      months: donorHealthMonthsMock.slice(-months),
    });
  }
}

export { DonorHealthGateway };
