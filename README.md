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

## 🐳 Running with Docker

### Development
Uses `docker-compose.yml` + `docker-compose.dev.yml`, mounts the local source, and runs Bun in watch mode.

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Detached mode:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Stop:

```bash
docker compose down
```

---

### Production
Builds the Dockerfile, installs production dependencies, and runs `bun src/index.ts` inside the container.

```bash
docker compose build
docker compose up -d
```

Rebuild + start:

```bash
docker compose up -d --build
```

Stop:

```bash
docker compose down
```

---

### Environment Variables
Create a `.env` file based on `.env.example`.

Required:
- `FLUXER_BOT_TOKEN=`

Optional:
- `NODE_ENV=development` (defaults to development behavior if not set)

## Run
```bash
bun install
bun run dev
```

## Add Commands
- Create a new file under `src/commands/` that exports `name` and `execute(client, message, args)`.
- The file should be ESM/TypeScript and use `.js` extensions for relative imports.
- Commands are loaded dynamically at startup; no manual registration needed.

## Type Checking & Optional Build
The bot runs TypeScript directly with Bun, so a build step is not required for normal usage.  
The `build` script exists primarily for CI or artifact generation.

```bash
bun run typecheck
bun run build
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
