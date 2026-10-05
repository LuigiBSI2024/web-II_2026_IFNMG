import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "vitest/config";

// A suíte nunca utiliza silenciosamente DATABASE_URL do .env de desenvolvimento.
dotenv.config({ path: path.resolve(process.cwd(), "tests.env"), quiet: true });
if (!process.env.TEST_DATABASE_URL) {
  throw new Error(
    "Defina TEST_DATABASE_URL em tests.ev apontando para um banco exclusivo de testes.",
  );
}

export default defineConfig({
  test: {
    environment: "node",
    env: { DATABASE_URL: process.env.TEST_DATABASE_URL },
    fileParallelism: false,
    setupFiles: ["./tests/setup.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.js"],
      exclude: ["src/server.js"],
    },
  },
});
