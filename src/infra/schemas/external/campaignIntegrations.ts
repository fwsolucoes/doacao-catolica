import { z } from "zod";

const externalCampaignIntegrationsSchema = z
  .object({
    projects: z.object({
      project_integration: z
        .object({
          google_analytics_pixel: z.string().nullable(),
          google_tag_manager_pixel: z.string().nullable(),
          facebook_pixel: z.string().nullable(),
          facebook_enable: z.boolean(),
          google_analytics_enable: z.boolean(),
        })
        .nullable(),
    }),
  })
  .passthrough();

type ExternalCampaignIntegrations = z.infer<
  typeof externalCampaignIntegrationsSchema
>;

export {
  externalCampaignIntegrationsSchema,
  type ExternalCampaignIntegrations,
};
