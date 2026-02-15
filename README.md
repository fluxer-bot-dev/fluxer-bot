# fluxer-bot

Fluxer is a Discord-compatible community platform. This repo contains a minimal bot that connects to Fluxer's REST + Gateway APIs and replies with `pong` when a user sends `!ping`.

## Setup

1. Create a Fluxer application and bot token via the [Fluxer dashboard](https://fluxer.app).
2. Invite/authorize the bot to your Fluxer community.
3. Set the token in your environment:

```bash
cp .env.example .env
# edit .env and set FLUXER_BOT_TOKEN
```

## Environment Variables

Create a `.env` file based on `.env.example`.

| Variable | Required | Description |
|---|---|---|
| `FLUXER_BOT_TOKEN` | Yes | Your bot token from the Fluxer dashboard |
| `NODE_ENV` | No | Defaults to development behavior if not set |

## Running Locally

```bash
bun install
bun run dev
```

## Running with Docker

### Development

Uses `docker-compose.yml` + `docker-compose.dev.yml`, mounts the local source, and runs Bun in watch mode.

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Detached mode:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Production

Builds the Dockerfile, installs production dependencies, and runs `bun src/index.ts` inside the container.

```bash
docker compose up -d --build
```

Stop either environment with:

```bash
docker compose down
```

## Adding Commands

Create a new file under `src/commands/` that exports `name` and `execute(client, message, args)`. The file should be ESM/TypeScript and use `.js` extensions for relative imports. Commands are loaded dynamically at startup — no manual registration needed.

## Type Checking & Build

The bot runs TypeScript directly with Bun, so a build step is not required for normal usage. The `build` script exists primarily for CI or artifact generation.

```bash
bun run typecheck
bun run build
```

## Lint & Format

```bash
bun run lint
bun run format
```

### Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) to automatically run Biome formatting and lint checks before every commit. If any staged files have issues, the commit will be blocked until they're resolved. You can auto-fix most issues with:

```bash
biome check --fix --unsafe .
```

## Troubleshooting

- Verify `FLUXER_BOT_TOKEN` is set and correct.
- Confirm the bot is authorized in the target community.
- Make sure the bot has permission to read and send messages in the channel.
