# fluxer-bot

Fluxer is a Discord-compatible community platform. This repo contains a small bot that connects to Fluxer's REST + Gateway APIs and replies with `pong` when a user sends `!ping`.

## Architecture

- Runtime: Bun + TypeScript (ESM). Commands live in `src/commands/` and are loaded dynamically.
- Data layer (intended): PostgreSQL as the primary database with Prisma as the ORM. Keep DB access in a dedicated layer separate from command logic.
- Docker: local development and production are Docker-based (Compose + Dockerfile).

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
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma and the bot |
| `NODE_ENV` | No | Defaults to development behavior if not set |
| `COMMAND_PREFIX` | No | Default command prefix when a guild override is not set |
| `PREFIX_CACHE_TTL_SECONDS` | No | Cache TTL (seconds) for per-guild prefixes (default 300) |

## Running Locally

```bash
bun install
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d postgres
bun run db:migrate
bun run dev
```

## Running with Docker

### Development

Uses `docker-compose.yml` + `docker-compose.dev.yml`. Set `DATABASE_URL` to use host `postgres` when running the bot in Docker.

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Detached mode:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Production

Builds the Dockerfile, installs production dependencies, runs migrations, and starts `bun src/index.ts` inside the container.

```bash
docker compose up -d --build
```

Stop either environment with:

```bash
docker compose down
```

## Adding Commands

Create a new file under `src/commands/` that exports `name` and `execute(client, message, args)`. The file should be ESM/TypeScript and use `.js` extensions for relative imports. Commands are loaded dynamically at startup — no manual registration needed.

## Prefix Commands

- Use `setprefix <prefix>` (admin only) to store a per-guild prefix.
- Use `resetprefix` (admin only) to return to the default prefix.
- Use `getprefix` to view the effective prefix.
- You can also mention the bot as a prefix, e.g. `@Bot getprefix`.

## Database

```bash
bun run db:migrate  # dev migrations
bun run db:deploy   # production deploy
bun run db:generate # regenerate Prisma client
bun run db:reset    # DEV ONLY: drops and recreates the database
```

## Type Checking & Build

The bot runs TypeScript directly with Bun, so a build step is not required for normal usage. The `build` script exists primarily for CI or artifact generation.

```bash
bun run typecheck
bun run build
```

## Testing

```bash
bun run test
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
