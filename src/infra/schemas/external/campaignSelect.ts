import { z } from "zod";

const campaignSelectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const campaignSelectSchema = z.array(campaignSelectItemSchema);

export { campaignSelectSchema };
