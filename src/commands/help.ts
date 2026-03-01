import type {
  BotClient,
  Command,
  MessageCreatePayload,
} from "../types/command.js";
import * as six from "./6.js";
import * as addrole from "./addrole.js";
import * as ping from "./ping.js";

export const name: Command["name"] = "help";

const commands: Pick<Command, "name" | "description">[] = [addrole, ping, six]; //TODO: This is a bit inefficient, we should find a better way to do this.
// Maybe we can export an array of commands from a central file and import it here?

export const execute: Command["execute"] = async (
  client: BotClient,
  message: MessageCreatePayload,
  _args: string[],
) => {
  const helpText = commands
    .map((cmd) => `**!${cmd.name}** - ${cmd.description}`)
    .join("\n");

  await client.api.channels.createMessage(message.channel_id, {
    content: `📋 **Available Commands:**\n\n${helpText}\n**!help** - Lists all available commands`,
  });
};
