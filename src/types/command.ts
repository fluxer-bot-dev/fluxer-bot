import type { Client } from '@discordjs/core';

export type BotClient = Client;
// Structural shape to avoid type identity conflicts from multiple discord-api-types copies.
export type MessageCreatePayload = {
  channel_id: string;
  content: string;
  guild_id: string; 
  author?: {
    bot?: boolean;
  };
};

export interface Command {
  name: string;
  execute(client: BotClient, message: MessageCreatePayload, args: string[]): Promise<void>;
}

