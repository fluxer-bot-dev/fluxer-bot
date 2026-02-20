import type { BotClient, MessageCreatePayload } from "./types/command.js";

const ADMINISTRATOR_BIT = 1n << 3n;

export async function isGuildAdmin(
  client: BotClient,
  message: MessageCreatePayload,
): Promise<boolean> {
  const guildId = message.guild_id;
  const userId = message.author?.id;

  if (!guildId || !userId) return false;

  const guild = await client.api.guilds.get(guildId);
  if (guild.owner_id === userId) return true;

  const memberRoleIds = message.member?.roles;
  if (!memberRoleIds || memberRoleIds.length === 0) return false;

  const roles = await client.api.guilds.getRoles(guildId);
  const roleIds = new Set([guildId, ...memberRoleIds]);

  let permissions = 0n;
  for (const role of roles) {
    if (!roleIds.has(role.id)) continue;
    if (!role.permissions) continue;
    try {
      permissions |= BigInt(role.permissions);
    } catch {}
  }

  return (permissions & ADMINISTRATOR_BIT) === ADMINISTRATOR_BIT;
}
