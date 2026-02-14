import { Client, GatewayDispatchEvents } from '@discordjs/core';

export function registerHandlers(client: Client): void {
  client.once(GatewayDispatchEvents.Ready, ({ data }) => {
    const user = data.user;
    const tag = `${user.username}#${user.discriminator}`;
    console.log(`Ready as ${tag}`);
  });

  client.on(GatewayDispatchEvents.MessageCreate, async ({ data: message, api }) => {
    if (message.author?.bot) return;
    if (message.content !== 'ping') return;

    await api.channels.createMessage(message.channel_id, { content: 'pong' });
  });
}
