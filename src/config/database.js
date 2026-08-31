import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../secrets.env") });

const isDevelopment = process.env.NODE_ENV !== "production";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
  log: isDevelopment ? ["query", "warn", "error"] : ["warn", "error"],
});

export default prisma;