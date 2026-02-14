import type { Command } from '../types/command.js';

export const name: Command['name'] = 'ping';

export const execute: Command['execute'] = async (
  client,
  message,
): Promise<void> => {
  await client.api.channels.createMessage(message.channel_id, { content: 'pong' });
};
