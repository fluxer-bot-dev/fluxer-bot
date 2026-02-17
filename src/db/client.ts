import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectDb(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error(
      "Missing DATABASE_URL. Set it in your environment or .env file.",
    );
    throw new Error("Missing DATABASE_URL");
  }

  try {
    await prisma.$connect();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

export async function disconnectDb(): Promise<void> {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("Failed to disconnect from database:", error);
  }
}
