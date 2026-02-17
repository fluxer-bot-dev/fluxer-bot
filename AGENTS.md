# AGENTS.md

## Intent and Non-Goals
- Intent: a minimal Fluxer bot that responds to `ping` with `pong` using the low-level discord.js core packages.
- Non-goals: frameworks, advanced command routing, databases, hosting setup, or complex observability.

## Project Invariants
Architecture & Philosophy
- Minimal architecture only.
- No frameworks.
- Message-based commands only (no slash commands).
- Strict TypeScript must remain enabled.
- ESM only; `.js` relative imports required.
- No `any` in runtime code.

Bun & Tooling
- Bun is the package manager and runtime.
- A lockfile must exist.
- `bun install --frozen-lockfile` must be used in Docker builds.
- No dependency version changes unless strictly required.
- Husky runs via `package.json` `prepare` in dev; Docker/CI must set `CI=true` to skip it.

Docker
- Dockerfile must remain multi-stage.
- Must use `oven/bun` base images.
- Production image must not include devDependencies.
- `.env` must never be copied into the image.
- No secrets in image layers.
- `docker-compose.yml` is production base.
- `docker-compose.dev.yml` is override-only.
- No additional services without explicit architectural justification.

Constraints
- Do not introduce logging frameworks.
- Do not introduce ORMs.
- Do not introduce routing abstractions.
- Keep runtime behavior identical unless explicitly instructed.

## Local Run + Manual Test
```bash
bun install
bun run dev
```
Manual test plan:
- Start the bot with `FLUXER_BOT_TOKEN` set.
- Send `ping` in a channel the bot can read.
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
