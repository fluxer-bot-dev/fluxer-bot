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
bun install
bun run dev
```

## Add Commands
- Create a new file under `src/commands/` that exports `name` and `execute(client, message, args)`.
- The file should be ESM/TypeScript and use `.js` extensions for relative imports.
- Commands are loaded dynamically at startup; no manual registration needed.

## Build + Start
```bash
bun run build
bun run start
```

## Lint + Format
```bash
bun run lint
bun run format
```

## Troubleshooting
- `FLUXER_BOT_TOKEN` is set and correct.
- The bot is authorized in the target community.
- The bot has permission to read and send messages in the channel.
