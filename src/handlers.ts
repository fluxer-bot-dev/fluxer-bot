import { Client, GatewayDispatchEvents } from '@discordjs/core';
import { loadCommands } from './commandLoader.js';

const PREFIX = process.env.COMMAND_PREFIX || '!';

export async function registerHandlers(client: Client): Promise<void> {
  const commands = await loadCommands();

  client.once(GatewayDispatchEvents.Ready, ({ data }) => {
    const user = data.user;
    const tag = `${user.username}#${user.discriminator}`;
    console.log(`Ready as ${tag}`);
  });

  client.on(GatewayDispatchEvents.MessageCreate, async ({ data: message }) => {
    if (message.author?.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const [commandName, ...args] = message.content.slice(PREFIX.length).split(' ');
    const command = commands.get(commandName);

    if (!command) return;

    await command.execute(client, message, args);
  });
}
