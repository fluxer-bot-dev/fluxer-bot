import type { BotClient, MessageCreatePayload } from "./types/command.js";

const ADMINISTRATOR_BIT = 1n << 3n;

export async function isGuildAdmin(
  client: BotClient,
  message: MessageCreatePayload,
): Promise<boolean> {
  const guildId = message.guild_id;
  const userId = message.author?.id;

  if (!guildId || !userId) return false;
  let guild: Awaited<ReturnType<BotClient["api"]["guilds"]["get"]>>;
  let roles: Awaited<ReturnType<BotClient["api"]["guilds"]["getRoles"]>>;

  try {
    guild = await client.api.guilds.get(guildId);
    roles = await client.api.guilds.getRoles(guildId);
  } catch (error) {
    console.error("Failed to fetch guild permissions:", error);
    return false;
  }

  if (guild.owner_id === userId) return true;

  const memberRoleIds = message.member?.roles;
  if (!memberRoleIds || memberRoleIds.length === 0) return false;

  const roleIds = new Set([guildId, ...memberRoleIds]);

  let permissions = 0n;
  for (const role of roles) {
    if (!roleIds.has(role.id)) continue;
    if (!role.permissions) continue;
    try {
      const raw = role.permissions;
      const parsed =
        typeof raw === "string" || typeof raw === "number" ? BigInt(raw) : 0n;
      permissions |= parsed;
    } catch (error) {
      console.error("Failed to parse role permissions:", error);
    }
  }

  return (permissions & ADMINISTRATOR_BIT) === ADMINISTRATOR_BIT;
}
