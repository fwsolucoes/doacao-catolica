import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  appDirectory: "./src",
  allowedActionOrigins: ["painel.doacaocatolica.com"],
} satisfies Config;
