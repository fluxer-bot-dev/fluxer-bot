import { type Client, GatewayDispatchEvents } from "@discordjs/core";
import { loadCommands } from "./commandLoader.js";

const PREFIX = process.env.COMMAND_PREFIX || "!";

/**
 * This function registers event handlers for the bot client.
 * It listens for the "Ready" event to log when the bot is ready, and for the "MessageCreate" event to handle incoming messages.
 * When a message is created, it checks if the message starts with the defined prefix and if it does, it attempts to execute the corresponding command.
 * The commands are loaded using the loadCommands function, which retrieves all available commands and their execution logic.
 * The command execution is done by calling the execute function of the matched command, passing in the client, message, and any arguments extracted from the message content.
 * This function is essential for setting up the bot's interaction with users and enabling it to respond to commands in the chat.
 * @param client
 */

export async function registerHandlers(client: Client): Promise<void> {
  const commands = await loadCommands();
  let botId: string | undefined;

  client.once(GatewayDispatchEvents.Ready, ({ data }) => {
    const { username, id: userid, discriminator } = data.user; // Destructure the username, discriminator, and id from the user data
    const tag = `${username}#${discriminator}`;
    botId = userid;
    console.log(`Ready as ${tag}`);
  });

  client.on(GatewayDispatchEvents.MessageCreate, async ({ data: message }) => {
    if (message.author?.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const body = message.content.slice(PREFIX.length).trim();
    const mentionRegex = botId ? new RegExp(`^<@!?${botId}>`) : /^<@!?\d+>/;

    // Ignore messages that are just mentions, as they are likely not intended as commands.
    // Unless the command is specifically designed to handle mentions, in which case it should be invoked with the appropriate command name.
    if (!body || mentionRegex.test(body)) return;

    const [commandName, ...args] = body.split(/\s+/);
    const command = commands.get(commandName);
    // TODO: Do a help command that lists all available commands and their descriptions.
    if (!command) {
      await client.api.channels.createMessage(message.channel_id, {
        content: `Unknown command: ${commandName}, Use \`${PREFIX}help\` to see available commands.`,
      });
      return;
    }

    await command.execute(client, message, args);
  });
}
