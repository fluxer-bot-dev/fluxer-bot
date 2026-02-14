import { Client } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { API_BASE_URL, API_VERSION, GATEWAY_VERSION } from './config.js';

export function createFluxerClient(token: string): {
  rest: REST;
  gateway: WebSocketManager;
  client: Client;
} {
  const rest = new REST({ version: API_VERSION, api: API_BASE_URL }).setToken(token);

  const gateway = new WebSocketManager({
    token,
    intents: 0,
    version: GATEWAY_VERSION,
    rest,
  });

  const client = new Client({ rest, gateway });

  gateway.on('error', (error) => {
    console.error('Gateway error:', error);
  });

  return { rest, gateway, client };
}
