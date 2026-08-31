import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import app from "./app.js";
import prisma from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../secrets.env") });

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
  console.log("Health check: http://localhost:" + PORT + "/health");
  console.log("Usuários: http://localhost:" + PORT + "/users");
});

async function shutdown(signal) {
  console.log("Recebido " + signal + ". Encerrando...");

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));