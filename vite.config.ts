import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import wyw from "@wyw-in-js/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig({
  server: { host: true },
  plugins: [tailwindcss(), wyw(), devtoolsJson(), reactRouter()],
  resolve:
    process.env.NODE_ENV === "development"
      ? { tsconfigPaths: true }
      : {
          alias: { "react-dom/server": "react-dom/server.node" },
          tsconfigPaths: true,
        },
});
