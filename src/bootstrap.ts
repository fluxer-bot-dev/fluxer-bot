import { API_BASE_URL, API_VERSION, GATEWAY_VERSION } from './config.js';

export function assertTokenPresent(token: string | undefined): string {
  console.log('[boot] starting fluxer bot');
  if (!token) {
    console.error('Missing FLUXER_BOT_TOKEN');
    process.exit(1);
  }
  console.log('[boot] token present');
  console.log(
    `[boot] api=${API_BASE_URL} rest_v=${API_VERSION} gw_v=${GATEWAY_VERSION} intents=0`,
  );
  return token;
}
