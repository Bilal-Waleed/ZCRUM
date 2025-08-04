import { PrismaClient } from "./generated/prisma";

export const db = globalThis.db || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}    