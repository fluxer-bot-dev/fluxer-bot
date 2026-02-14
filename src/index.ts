import { Client, GatewayDispatchEvents } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { Routes, type RESTGetAPIGatewayBotResult } from 'discord-api-types/v10';

import { API_BASE_URL, API_VERSION, BOT_TOKEN, GATEWAY_VERSION } from './config.js';

console.log('[boot] starting fluxer bot');
if (!BOT_TOKEN) {
  console.error('Missing FLUXER_BOT_TOKEN');
  process.exit(1);
}
console.log('[boot] token present');

const rest = new REST({ version: API_VERSION, api: API_BASE_URL }).setToken(BOT_TOKEN);

const gateway = new WebSocketManager({
  token: BOT_TOKEN,
  intents: 0,
  version: GATEWAY_VERSION,
  rest,
  fetchGatewayInformation() {
    return rest.get(Routes.gatewayBot()) as Promise<RESTGetAPIGatewayBotResult>;
  },
});

const client = new Client({ rest, gateway });

gateway.on('error', (error) => {
  console.error('Gateway error:', error);
});

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

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down.');
  process.exit(0);
});

async function main() {
  console.log('[gateway] connecting...');
  await gateway.connect();
  console.log('[gateway] connect() resolved');
}

main().catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});
