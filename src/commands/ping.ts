import { recordCommandInvocation } from "../data/commandInvocations.js";
import type { Command } from "../types/command.js";

export const name: Command["name"] = "ping";
/**
 * This command responds with "pong" when invoked.
 * It serves as a simple test command to verify that the command handling system is working correctly.
 * Usage: !ping
 * This command does not require any arguments and will always respond with the same message.
 * @param client
 * @param message
 */
export const execute: Command["execute"] = async (
  client,
  message,
): Promise<void> => {
  try {
    await recordCommandInvocation({
      command: name,
      guildId: message.guild_id,
      channelId: message.channel_id,
      userId: message.author?.id,
    });
  } catch (error) {
    console.error("Failed to record command invocation:", error);
  }

  await client.api.channels.createMessage(message.channel_id, {
    content: "pong",
  });
};
