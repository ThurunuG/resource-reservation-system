import { PrismaClient } from "@prisma/client";

// Reuse the Prisma client during development to avoid creating extra instances
// whenever this module is reloaded.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Log warnings and errors in development, and errors only in other environments.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

// Keep the client on globalThis outside production to support hot reloading.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;