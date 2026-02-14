import type { BotClient, MessageCreatePayload } from '../types/command.js';

export const name = 'ping';

export async function execute(
  client: BotClient,
  message: MessageCreatePayload,
  _args: string[],
): Promise<void> {
  await client.api.channels.createMessage(message.channel_id, { content: 'pong' });
}
