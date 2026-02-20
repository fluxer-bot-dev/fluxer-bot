import { setGuildPrefix } from "../data/guildSettings.js";
import { isGuildAdmin } from "../permissions.js";
import type {
  BotClient,
  Command,
  MessageCreatePayload,
} from "../types/command.js";

const MAX_PREFIX_LENGTH = 32;

export const name: Command["name"] = "setprefix";

export async function execute(
  client: BotClient,
  message: MessageCreatePayload,
  args: string[],
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
      content: "You need administrator permissions to change the prefix.",
    });
    return;
  }

  const nextPrefix = args[0]?.trim();

  if (!nextPrefix) {
    await client.api.channels.createMessage(message.channel_id, {
      content: "Usage: setprefix <prefix>",
    });
    return;
  }

  if (nextPrefix.length > MAX_PREFIX_LENGTH) {
    await client.api.channels.createMessage(message.channel_id, {
      content: `Prefix must be ${MAX_PREFIX_LENGTH} characters or fewer.`,
    });
    return;
  }

  await setGuildPrefix(guildId, nextPrefix);

  await client.api.channels.createMessage(message.channel_id, {
    content: `Prefix updated to \`${nextPrefix}\`.`,
    allowed_mentions: { parse: [] },
  });
}
