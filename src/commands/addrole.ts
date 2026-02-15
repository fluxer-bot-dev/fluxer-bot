import type { BotClient, MessageCreatePayload, Command } from '../types/command.js';

export const name: Command['name'] = 'addrole';
/**
 * This command allows you to add a role to a user in the guild. 
 * The command expects two arguments: the user's tag (e.g., user#0000) and the role ID. 
 * Usage: !addrole user#0000 <roleId>
 * It will search for the user in the guild's member list and, if found, will add the specified role to that user. 
 * If the user is not found or if the arguments are not provided correctly, it will respond with an error message indicating the correct usage of the command.
 * Note: This command requires the bot to have the appropriate permissions to manage roles in the Fluxers.
 * @param client 
 * @param message 
 * @param args 
 * @returns void
 */
export async function execute(
  client: BotClient,
  message: MessageCreatePayload,
  args: string[],
): Promise<void> {
  const mention = args[0];
  const roleName = args.slice(1).join(' ');

  const mentionMatch = mention?.match(/^<@!?(\d+)>$/);

  if (!mentionMatch || !roleName) {
    await client.api.channels.createMessage(message.channel_id, {
      content: 'Usage: !addrole @user <roleName>',
    });
    return;
  }

  const userId = mentionMatch[1];

  const roles = await client.api.guilds.getRoles(message.guild_id);
  const role = roles.find(
    (r) => r.name.toLowerCase() === roleName.toLowerCase(),
  );

  if (!role) {
    await client.api.channels.createMessage(message.channel_id, {
      content: `Could not find role "${roleName}"`,
    });
    return;
  }

  try {
    await client.api.guilds.addRoleToMember(message.guild_id, userId, role.id);

    await client.api.channels.createMessage(message.channel_id, {
      content: `Added role "${role.name}" to <@${userId}>!`,
    });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Unknown error';
    await client.api.channels.createMessage(message.channel_id, {
      content: `WIP`,
    });
  }
}
// Note: This is a work in progress command and may not function correctly until Fluxer fixes the underlying issue.
// It is a reported issue https://github.com/fluxerapp/fluxer/issues/154 
