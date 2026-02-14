export const name = 'ping';

export async function execute(
  client: any,
  message: any,
  _args: string[],
): Promise<void> {
  await client.api.channels.createMessage(message.channel_id, { content: 'pong' });
}
