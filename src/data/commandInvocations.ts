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
  await prisma.commandInvocation.create({
    data: {
      command: input.command,
      guildId: input.guildId,
      channelId: input.channelId,
      userId: input.userId,
    },
  });
}
