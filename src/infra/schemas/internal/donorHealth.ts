import { z } from "zod";

const DONOR_HEALTH_MONTHS_OPTIONS = [12, 24, 36] as const;
const DONOR_HEALTH_LAPSE_OPTIONS = [3, 6, 9, 12] as const;

const DEFAULT_MONTHS = 24;
const DEFAULT_LAPSE_MONTHS = 6;

function oneOf(options: readonly number[], fallback: number) {
  return z
    .string()
    .optional()
    .transform((v) => {
      const value = Number(v);
      return options.includes(value) ? value : fallback;
    });
}

// Filtros vêm da query string; valores fora das opções caem no padrão em vez de quebrar a tela.
const donorHealthQuerySchema = z.object({
  months: oneOf(DONOR_HEALTH_MONTHS_OPTIONS, DEFAULT_MONTHS),
  lapse_months: oneOf(DONOR_HEALTH_LAPSE_OPTIONS, DEFAULT_LAPSE_MONTHS),
});

type DonorHealthQuery = z.infer<typeof donorHealthQuerySchema>;

export {
  DEFAULT_LAPSE_MONTHS,
  DEFAULT_MONTHS,
  DONOR_HEALTH_LAPSE_OPTIONS,
  DONOR_HEALTH_MONTHS_OPTIONS,
  donorHealthQuerySchema,
  type DonorHealthQuery,
};
