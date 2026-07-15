import { z } from "zod";

const isDateTodayOrInFuture = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setUTCHours(0);
  return new Date(date) >= today;
};

const upcomingPaymentsSchema = z
  .object({
    subscriptionUuid: z.uuid({ message: "UUID da assinatura inválido" }),
    startDate: z
      .string()
      .min(1, "Data de início é obrigatória")
      .refine(isDateTodayOrInFuture, {
        message: "A data de início não pode ser menor que hoje",
      }),
    endDate: z.string().min(1, "Data de término é obrigatória"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "A data de término deve ser maior ou igual à data de início",
    path: ["endDate"],
  });

type UpcomingPaymentsType = z.infer<typeof upcomingPaymentsSchema>;

export { upcomingPaymentsSchema, type UpcomingPaymentsType };
