import { z } from "zod";

const externalTransferSchema = z.object({
  uuid: z.string().uuid(),
  status: z.string(),
  type: z.string(),
  paid_date: z.string().nullable(),
  amount: z.number(),
  created_at2: z.string(),
  updated_at2: z.string(),
  deleted_at2: z.string().nullable(),
});

const externalTransfersSchema = z.object({
  data: z.object({
    data: z.array(externalTransferSchema),
    total: z.number(),
    current_page: z.number(),
    last_page: z.number(),
  }),
});

const externalTransferMetricsSchema = z.object({
  data: z.object({
    total_received: z.number(),
    balance_available: z.number(),
    withdrawals_made: z.number(),
  }),
});

type ExternalTransfer = z.infer<typeof externalTransferSchema>;

export {
  externalTransferMetricsSchema,
  externalTransfersSchema,
  type ExternalTransfer,
};
