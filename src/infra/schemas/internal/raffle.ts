import { z } from "zod";

const requiredInteger = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((v) => /^\d+$/.test(v), "Informe um número inteiro")
    .transform(Number);

const optionalInteger = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^\d+$/.test(v), "Informe um número inteiro")
  .transform((v) => (v ? Number(v) : undefined));

const ticketPrice = z
  .string()
  .min(1, "Informe o valor do bilhete")
  .transform(Number)
  .refine((v) => Number.isFinite(v) && v > 0, "O valor do bilhete deve ser maior que zero");

const raffleBaseSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do sorteio"),
  // <input type="date"> envia YYYY-MM-DD
  startDate: z.string().min(1, "Informe a data inicial"),
  endDate: z.string().min(1, "Informe a data final"),
  // Switch (Radix) só envia o campo quando marcado — ausência = desligado
  enabled: z.string().optional().transform((v) => v === "true"),
});

type RangeFields = {
  startDate: string;
  endDate: string;
  startNumber?: number;
  endNumber?: number;
};

function validateRanges(data: RangeFields, ctx: z.RefinementCtx) {
  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    ctx.addIssue({
      code: "custom",
      path: ["endDate"],
      message: "A data final deve ser igual ou posterior à data inicial",
    });
  }

  if (
    data.startNumber !== undefined &&
    data.endNumber !== undefined &&
    data.endNumber < data.startNumber
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["endNumber"],
      message: "O número final deve ser maior ou igual ao inicial",
    });
  }
}

// API espera Y-m-d H:i:s — o sorteio vale do início do dia inicial ao fim do dia final.
function toPeriod<T extends { startDate: string; endDate: string }>(data: T) {
  const { startDate, endDate, ...rest } = data;
  return {
    ...rest,
    startsAt: `${startDate} 00:00:00`,
    endsAt: `${endDate} 23:59:59`,
  };
}

const createRaffleSchema = raffleBaseSchema
  .extend({
    ticketPrice,
    startNumber: requiredInteger("Informe o número inicial"),
    endNumber: requiredInteger("Informe o número final"),
  })
  .superRefine(validateRanges)
  .transform(toPeriod);

// Após a primeira venda, ticketPrice e startNumber ficam desabilitados no formulário
// e não são enviados — por isso são opcionais aqui.
const updateRaffleSchema = raffleBaseSchema
  .extend({
    id: z.uuid({ message: "Sorteio inválido" }),
    ticketPrice: ticketPrice.optional(),
    startNumber: optionalInteger,
    endNumber: requiredInteger("Informe o número final"),
  })
  .superRefine(validateRanges)
  .transform(toPeriod);

type CreateRaffleBody = z.infer<typeof createRaffleSchema>;
type UpdateRaffleBody = z.infer<typeof updateRaffleSchema>;

export {
  createRaffleSchema,
  updateRaffleSchema,
  type CreateRaffleBody,
  type UpdateRaffleBody,
};
