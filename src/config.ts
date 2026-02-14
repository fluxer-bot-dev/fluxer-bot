import dotenv from 'dotenv';

dotenv.config();

export const API_BASE_URL = 'https://api.fluxer.app';
export const API_VERSION = '1';
export const GATEWAY_VERSION = '1';

export const BOT_TOKEN = process.env.FLUXER_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('Missing FLUXER_BOT_TOKEN. Set it in your environment or .env file.');
  process.exit(1);
}
