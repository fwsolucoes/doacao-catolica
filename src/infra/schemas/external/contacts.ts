import { z } from "zod";

const externalContactItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const listContactsSchema = z.array(externalContactItemSchema);

type ExternalContactItem = z.infer<typeof externalContactItemSchema>;

export { listContactsSchema, type ExternalContactItem };
