import { getGuildPrefix } from "../data/guildSettings.js";
import { normalizePrefix } from "../prefix.js";
import type {
  BotClient,
  Command,
  MessageCreatePayload,
} from "../types/command.js";

const DEFAULT_PREFIX = normalizePrefix(process.env.COMMAND_PREFIX, "!");

export const name: Command["name"] = "getprefix";

export async function execute(
  client: BotClient,
  message: MessageCreatePayload,
): Promise<void> {
  const guildId = message.guild_id;

  if (!guildId) {
    await client.api.channels.createMessage(message.channel_id, {
      content: `Current prefix is \`${DEFAULT_PREFIX}\`.`,
      allowed_mentions: { parse: [] },
    });
    return;
  }

  const guildPrefix = await getGuildPrefix(guildId);
  const effectivePrefix = normalizePrefix(
    guildPrefix ?? undefined,
    DEFAULT_PREFIX,
  );

  await client.api.channels.createMessage(message.channel_id, {
    content: `Current prefix is \`${effectivePrefix}\`.`,
    allowed_mentions: { parse: [] },
  });
}
