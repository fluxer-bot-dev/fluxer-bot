import type { Client } from '@discordjs/core';
import type { GatewayMessageCreateDispatchData } from 'discord-api-types/v10';

export type BotClient = Client;
export type MessageCreatePayload = GatewayMessageCreateDispatchData;

export interface Command {
  name: string;
  execute(client: BotClient, message: MessageCreatePayload, args: string[]): Promise<void>;
}
