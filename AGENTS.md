# AGENTS.md

## Intent and Non-Goals
- Intent: a small Fluxer bot that responds to `!ping` with `pong` using the low-level discord.js core packages.
- Non-goals: advanced command routing, complex observability, or hosting setup beyond Docker.

## Project Invariants
Architecture & Standards
- Message-based commands only (no slash commands).
- Strict TypeScript must remain enabled.
- ESM only; `.js` relative imports required.
- No `any` in runtime code.
- Keep runtime behavior identical unless explicitly instructed.

Data & Persistence (Intended)
- PostgreSQL is the primary database.
- Prisma is the ORM.
- Keep DB access in a dedicated data layer; command logic should call into that layer.

Bun & Tooling
- Bun is the package manager and runtime.
- A lockfile must exist.
- Docker builds should use `bun install --frozen-lockfile`.
- Keep dependency upgrades intentional; avoid churn.
- Husky runs via `package.json` `prepare` in dev; Docker/CI should set `CI=true` or `NODE_ENV=production` to skip it.

Docker
- Dockerfile uses `oven/bun` base images.
- Production image installs only production dependencies.
- `.env` must never be copied into the image.
- No secrets in image layers.
- `docker-compose.yml` is production base.
- `docker-compose.dev.yml` is override-only.
- Local development and production are Docker-based; include database services in Compose when persistence is added.

## Local Run + Manual Test
```bash
bun install
bun run dev
```
Manual test plan:
- Start the bot with `FLUXER_BOT_TOKEN` set.
- Send `!ping` in a channel the bot can read.
- Confirm the bot replies with `pong`.

## File Layout
- `src/index.ts` entrypoint and gateway message handlers.
- `src/config.ts` environment + Fluxer endpoint configuration.
- Add new features in `src/` with small focused modules; wire them in `src/index.ts`.

## Rules of Engagement
- Prefer small, reviewable diffs.
- Update `README.md` when adding env vars or scripts.
- Never commit secrets; keep `.env.example` updated.
- When behavior changes, update or add a short “Manual test plan” section in PR-style notes.
- Keep TypeScript strictness intact.

## Command System & Typing Rules
- `src/commands/` must contain ONLY runtime command modules.
- Shared command types live in `src/types/command.ts` (`Command`, `BotClient`, `MessageCreatePayload`).
- `any` is forbidden in commands.
- All commands must conform to the shared `Command` interface.
- New commands live in `src/commands/` and must export `name` and `execute`.
- Dynamic imports in `src/commandLoader.ts` must conform to the `Command` interface.
- Keep strict TypeScript compliance.

Example command module:
```ts
import type { BotClient, MessageCreatePayload, Command } from '../types/command.js';

export const name: Command['name'] = 'hello';

export async function execute(
  client: BotClient,
  message: MessageCreatePayload,
  _args: string[],
): Promise<void> {
  await client.api.channels.createMessage(message.channel_id, { content: 'hello' });
}
```

## Roadmap Ideas
- Command router or dispatcher
- Structured logging
- Error handling + retries
- Slash commands or interactions
- Deployment (Docker/PM2/GitHub Actions)
