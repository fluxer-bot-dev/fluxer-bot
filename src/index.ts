import { Client, GatewayDispatchEvents } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import type { RESTGetAPIGatewayBotResult } from 'discord-api-types/v10';

import { API_BASE_URL, API_VERSION, BOT_TOKEN, GATEWAY_VERSION } from './config.js';

const rest = new REST({ version: API_VERSION, api: API_BASE_URL }).setToken(BOT_TOKEN);

const gateway = new WebSocketManager({
  token: BOT_TOKEN,
  intents: 0,
  version: GATEWAY_VERSION,
  fetchGatewayInformation: () =>
    rest.get('/gateway/bot') as Promise<RESTGetAPIGatewayBotResult>,
});

const client = new Client({ rest, gateway });

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

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

async function main() {
  await gateway.connect();
}

main().catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});
