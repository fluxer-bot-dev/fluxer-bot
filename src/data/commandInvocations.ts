import { prisma } from "../db/client.js";

export type CommandInvocationInput = {
  command: string;
  guildId?: string;
  channelId: string;
  userId?: string;
};

export async function recordCommandInvocation(
  input: CommandInvocationInput,
): Promise<void> {
  try {
    await prisma.commandInvocation.create({
      data: {
        command: input.command,
        guildId: input.guildId,
        channelId: input.channelId,
        userId: input.userId,
      },
    });
  } catch (error) {
    console.error("Failed to record command invocation:", error);
  }
}
