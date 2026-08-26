import type { AmbassadorsDashboardSearchParams } from "~/app/search/ambassadorsDashboardSearchParams";
import type {
  AmbassadorsDashboardData,
  AmbassadorsDashboardGatewayDTO,
} from "~/domain/gateways/ambassadorsDashboard";
import { Ambassador } from "~/domain/entities/ambassador";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { webworkerApi } from "../http/webworkerApi";
import { externalAmbassadorsDashboardSchema } from "../schemas/external/ambassadorsDashboard";

class AmbassadorsDashboardGateway implements AmbassadorsDashboardGatewayDTO {
  async getDashboard(
    campaignId: string,
    searchParams: AmbassadorsDashboardSearchParams,
  ): Promise<AmbassadorsDashboardData> {
    let url = "/donation/ambassadors/dashboard";
    url += searchParams.toExternal(["pageLimit"]);

    const apiResponse = await webworkerApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    if (!apiResponse.response) {
      return {
        summary: {
          totalAmbassadors: 0,
          periodIndications: 0,
          previousPeriod: {
            startDate: "",
            endDate: "",
            periodIndications: 0,
            variationPercent: null,
          },
          totalIndications: 0,
          totalRecurringAmount: 0,
          totalRaisedAmount: 0,
        },
        charts: {
          indicationsByDay: [],
          donationAmountRanges: [],
          paymentMethods: [],
        },
        ambassadors: [],
        pagination: {
          currentPage: 1,
          perPage: 15,
          from: null,
          to: null,
          total: 0,
          lastPage: 1,
        },
      };
    }

    const { data } = new SchemaValidatorAdapter(
      externalAmbassadorsDashboardSchema,
    ).validate(apiResponse.response);

    if (!data) {
      return {
        summary: {
          totalAmbassadors: 0,
          periodIndications: 0,
          previousPeriod: {
            startDate: "",
            endDate: "",
            periodIndications: 0,
            variationPercent: null,
          },
          totalIndications: 0,
          totalRecurringAmount: 0,
          totalRaisedAmount: 0,
        },
        charts: {
          indicationsByDay: [],
          donationAmountRanges: [],
          paymentMethods: [],
        },
        ambassadors: [],
        pagination: {
          currentPage: 1,
          perPage: 15,
          from: null,
          to: null,
          total: 0,
          lastPage: 1,
        },
      };
    }

    const { summary, charts, ambassadors } = data;

    return {
      summary: {
        totalAmbassadors: summary.total_ambassadors,
        periodIndications: summary.period_indications,
        previousPeriod: {
          startDate: summary.previous_period.start_date,
          endDate: summary.previous_period.end_date,
          periodIndications: summary.previous_period.period_indications,
          variationPercent: summary.previous_period.variation_percent,
        },
        totalIndications: summary.total_indications,
        totalRecurringAmount: summary.total_recurring_amount,
        totalRaisedAmount: summary.total_raised_amount,
      },
      charts: {
        indicationsByDay: (charts.indications_by_day ?? []).map((d) => ({
          date: d.date,
          label: d.label,
          totalIndications: d.total_indications,
          totalAmount: d.total_amount,
        })),
        donationAmountRanges: (charts.donation_amount_ranges ?? []).map(
          (r) => ({
            key: r.key,
            label: r.label,
            totalPayments: r.total_payments,
            totalAmount: r.total_amount,
          }),
        ),
        paymentMethods: (charts.payment_methods ?? []).map((m) => ({
          type: m.type,
          label: m.label,
          totalPayments: m.total_payments,
          totalAmount: m.total_amount,
          percentage: m.percentage,
        })),
      },
      ambassadors: ambassadors.data.map((item) =>
        Ambassador.restore({
          id: item.id,
          projectId: item.project_id,
          rank: item.rank,
          name: item.name,
          email: item.email,
          phone: item.phone,
          status: item.status,
          code: item.code,
          createdAt: item.created_at,
          periodIndications: item.period_indications,
          totalIndications: item.total_indications,
          totalRecurringAmount: item.total_recurring_amount,
          totalRaisedAmount: item.total_raised_amount,
          totalPaidPayments: item.total_paid_payments,
        }).toJson(),
      ),
      pagination: {
        currentPage: ambassadors.pagination.current_page,
        perPage: ambassadors.pagination.per_page,
        from: ambassadors.pagination.from,
        to: ambassadors.pagination.to,
        total: ambassadors.pagination.total,
        lastPage: ambassadors.pagination.last_page,
      },
    };
  }
}

export { AmbassadorsDashboardGateway };
