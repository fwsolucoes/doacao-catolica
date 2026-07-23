import { z } from "zod";

const sentNotificationsSchema = z.object({
  data: z.object({
    data: z.array(
      z.object({
        uuid: z.string(),
        // known values: "whatsapp" | "email" | "sms"
        channel: z.string(),
        entity_name: z.string(),
        payment_due_date: z.string().nullable(),
        // known values: "payment_before_due_date" | "payment_after_due_date" | ...
        notification_type: z.string(),
        // known values: "success" | "error" | "not_send" | "blocked" | "awaiting_confirmation"
        log_type: z.string(),
        request: z.unknown(),
        response: z.string(),
        service: z.string().nullable().optional(),
        email_address: z.string().nullable().optional(),
        entity_uuid: z.string().nullable(),
        customer: z.object({
          name: z.string().nullable(),
          email: z.string().nullable(),
          phone: z.string().nullable(),
        }),
        created_at2: z.string(),
        updated_at2: z.string(),
        deleted_at2: z.string().nullable(),
      }),
    ),
    total: z.number(),
    current_page: z.number(),
    last_page: z.number(),
    per_page: z.number().optional(),
  }),
});

export { sentNotificationsSchema };
