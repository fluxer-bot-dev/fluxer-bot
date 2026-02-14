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
console.log(
  `[boot] api=${API_BASE_URL} rest_v=${API_VERSION} gw_v=${GATEWAY_VERSION} intents=0`,
);

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

let shouldStop = false;

process.on('SIGINT', () => {
  shouldStop = true;
  console.log('Received SIGINT, shutting down.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  shouldStop = true;
  console.log('Received SIGTERM, shutting down.');
  process.exit(0);
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithTimeout(timeoutMs = 15_000) {
  let timeoutId: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`connect timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    await Promise.race([gateway.connect(), timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function formatErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return 'unknown error';
  }
}

async function runGatewayLoop() {
  let backoffMs = 2_000;
  const backoffCapMs = 60_000;

  while (!shouldStop) {
    try {
      console.log('[gateway] connecting...');
      await connectWithTimeout();
      console.log('[gateway] connected');
      return;
    } catch (error) {
      const message = formatErrorMessage(error);
      console.error(`[gateway] connect failed: ${message}`);
      if (shouldStop) return;

      const jitterFactor = 1 + (Math.random() * 0.4 - 0.2);
      const waitMs = Math.max(0, Math.round(backoffMs * jitterFactor));
      console.log(`[gateway] retrying in ${waitMs}ms`);
      await sleep(waitMs);

      backoffMs = Math.min(backoffCapMs, Math.round(backoffMs * 1.7));
    }
  }
}

async function main() {
  await runGatewayLoop();
}

main().catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});
