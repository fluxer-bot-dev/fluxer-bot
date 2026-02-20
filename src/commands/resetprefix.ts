import { clearGuildPrefix } from "../data/guildSettings.js";
import { isGuildAdmin } from "../permissions.js";
import type {
  BotClient,
  Command,
  MessageCreatePayload,
} from "../types/command.js";

const DEFAULT_PREFIX = process.env.COMMAND_PREFIX || "!";

export const name: Command["name"] = "resetprefix";

export async function execute(
  client: BotClient,
  message: MessageCreatePayload,
): Promise<void> {
  const guildId = message.guild_id;

  if (!guildId) {
    await client.api.channels.createMessage(message.channel_id, {
      content: "This command can only be used in a server.",
    });
    return;
  }

  const isAdmin = await isGuildAdmin(client, message);
  if (!isAdmin) {
    await client.api.channels.createMessage(message.channel_id, {
      content: "You need administrator permissions to reset the prefix.",
    });
    return;
  }

  await clearGuildPrefix(guildId);

  await client.api.channels.createMessage(message.channel_id, {
    content: `Prefix reset to default \`${DEFAULT_PREFIX}\`.`,
    allowed_mentions: { parse: [] },
  });
}
