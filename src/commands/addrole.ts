import type { BotClient, MessageCreatePayload, Command } from '../types/command.js';

export const name: Command['name'] = 'addrole';

export async function execute(
  client: BotClient,
  message: MessageCreatePayload,
  args: string[],
): Promise<void> {
   console.log('raw args:', args);
  // Expect: !addrole @user <roleName>
  const mention = args[0];
  const roleName = args.slice(1).join(' ');

  // Extract user ID from mention format <@userId> or <@!userId>
  const mentionMatch = mention?.match(/^<@!?(\d+)>$/);

  if (!mentionMatch || !roleName) {
    await client.api.channels.createMessage(message.channel_id, {
      content: 'Usage: !addrole @user <roleName>',
    });
    return;
  }

  const userId = mentionMatch[1];

  // Find the role by name (case-insensitive)
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
//Failed to add role: ${msg} when fluxers fixes this issue it will be added back in the error message.