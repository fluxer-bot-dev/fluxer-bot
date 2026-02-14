# Fluxer Bot (Ping/Pong)

Fluxer is a Discord-compatible community platform. This repo contains a minimal bot that connects to Fluxer’s REST + Gateway APIs and replies with `pong` when a user sends `ping`.

## Setup
1. Create a Fluxer application and bot token (Fluxer dashboard).
2. Invite/authorize the bot to your Fluxer community.
3. Set the token in your environment (see `.env.example`).

```bash
cp .env.example .env
# edit .env and set FLUXER_BOT_TOKEN
```

## Run
```bash
npm install
npm run dev
```

## Build + Start
```bash
npm run build
npm start
```

## Troubleshooting
- `FLUXER_BOT_TOKEN` is set and correct.
- The bot is authorized in the target community.
- The bot has permission to read and send messages in the channel.
