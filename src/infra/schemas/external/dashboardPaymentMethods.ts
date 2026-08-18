import { z } from "zod";

const externalDashboardPaymentMethodsSchema = z.object({
  message: z.string(),
  data: z.object({
    total_amount: z.number(),
    donations_count: z.number(),
    payment_methods: z.array(
      z.object({
        payment_method: z.string(),
        donations_count: z.number(),
        total_amount: z.number(),
        percentage: z.number(),
      }),
    ),
  }),
});

export { externalDashboardPaymentMethodsSchema };
