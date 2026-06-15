import { z } from "zod";

class EnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvError";
  }
}

const environmentVariablesSchema = z.object({
  // API configuration
  API_URL: z.string(),
  API_DATABASE: z.string(),
  API_URL_DONATION: z.string(),
  API_KEY_DONATION: z.string(),

  // Google OAuth configuration
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URL: z.string(),

  // File storage configuration
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_DOMAIN: z.url(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),

  ADMIN_PROFESSIONAL_ROLE_ID: z.string(),
  PROFESSIONAL_ROLE_ID: z.string(),

  // Logging
  TRAFFIC_SOURCE_ID: z.uuid(),
  TRAFFIC_SOURCE_TOKEN: z.string(),

  DARK_LOGO: z.url(),
  LIGHT_LOGO: z.url(),
  MOBILE_LOGO: z.url(),
});

function formatErrorMessage(error: z.ZodError) {
  const title = "Error validating env variables:";
  const lines = Object.entries(error.flatten().fieldErrors).map(
    ([key, value]) => `-> ${key}: ${value}`,
  );
  return [title, ...lines].join("\n");
}

const parsedEnv = () => {
  try {
    return environmentVariablesSchema.parse(process.env);
  } catch (error: any) {
    throw new EnvError(formatErrorMessage(error));
  }
};

const environmentVariables = parsedEnv();

export { environmentVariables };
