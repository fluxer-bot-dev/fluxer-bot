# AGENTS.md

## Intent and Non-Goals
- Intent: a minimal Fluxer bot that responds to `ping` with `pong` using the low-level discord.js core packages.
- Non-goals: frameworks, advanced command routing, databases, hosting setup, or complex observability.

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
