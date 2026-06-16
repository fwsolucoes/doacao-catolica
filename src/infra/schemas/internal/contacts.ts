import { z } from "zod";

const listContactsSchema = z.object({
  name: z.string().optional(),
});

export { listContactsSchema };
