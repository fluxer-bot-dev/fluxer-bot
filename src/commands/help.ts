import type {
  BotClient,
  Command,
  MessageCreatePayload,
} from "../types/command.js";
import * as addrole from "./addrole.js";
import * as ping from "./ping.js";

export const name: Command["name"] = "help";

const commands = [{ name: addrole.name }, { name: ping.name }];

export const execute: Command["execute"] = async (
  client: BotClient,
  message: MessageCreatePayload,
  _args: string[],
) => {
  const helpText = commands.map((cmd) => `**!${cmd.name}**`).join("\n");

  await client.api.channels.createMessage(message.channel_id, {
    content: `📋 **Available Commands:**\n\n${helpText}\n**!help** - Lists all available commands`,
  });
};
