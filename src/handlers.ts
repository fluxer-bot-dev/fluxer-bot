import { Client, GatewayDispatchEvents } from '@discordjs/core';
import { loadCommands } from './commandLoader.js';

export async function registerHandlers(client: Client): Promise<void> {
  const commands = await loadCommands();

  client.once(GatewayDispatchEvents.Ready, ({ data }) => {
    const user = data.user;
    const tag = `${user.username}#${user.discriminator}`;
    console.log(`Ready as ${tag}`);
  });

  client.on(GatewayDispatchEvents.MessageCreate, async ({ data: message }) => {
    if (message.author?.bot) return;
    if (message.content !== 'ping') return;

    const [commandName, ...args] = message.content.split(' ');
    const command = commands.get(commandName);

    if (!command) {
      console.warn(`Unknown command: ${commandName}`);
      return;
    }

    await command.execute(client, message, args);
  });
}
