import type { BotClient, MessageCreatePayload, Command } from '../types/command.js';

export const name: Command['name'] = '6';

export async function execute(
  client: BotClient,
  message: MessageCreatePayload,
  _args: string[],
): Promise<void> {
  await client.api.channels.createMessage(message.channel_id, { content: '7' });
}
