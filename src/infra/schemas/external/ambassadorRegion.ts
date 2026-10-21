import { z } from "zod";

const externalAmbassadorRegionsSchema = z.object({
  success: z.boolean(),
  data: z.array(z.string()).nullish(),
});

export { externalAmbassadorRegionsSchema };
