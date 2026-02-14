import type { BotClient, MessageCreatePayload, Command } from '../types/command.js';

export const name: Command['name'] = 'addrole';

export async function execute(
  client: BotClient,
  message: MessageCreatePayload,
  args: string[],
): Promise<void> {
  // Expect: !addrole user#0000 <roleId>
  const userTag = args[0];
  const roleId = args[1];

  if (!userTag?.includes('#') || !roleId) {
    await client.api.channels.createMessage(message.channel_id, {
      content: 'Usage: !addrole user#0000 <roleId>',
    });
    return;
  }

  const [username, discriminator] = userTag.split('#');

  const members = await client.api.guilds.getMembers(message.guild_id, { limit: 1000 });
  const member = members.find(
    (m) => m.user?.username === username && m.user?.discriminator === discriminator,
  );

  if (!member) {
    await client.api.channels.createMessage(message.channel_id, {
      content: `Could not find user ${userTag}`,
    });
    return;
  }

  await client.api.guilds.addRoleToMember(message.guild_id, member.user!.id, roleId);

  await client.api.channels.createMessage(message.channel_id, {
    content: `Role added to ${userTag}!`,
  });
}
