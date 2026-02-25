import { beforeAll, beforeEach, expect, mock, test } from "bun:test";
import { normalizePrefix } from "../../src/prefix.js";
import type { MessageCreatePayload } from "../../src/types/command.js";
import { createMessagePayload, createMockClient } from "../helpers.js";

const clearGuildPrefix = mock(async () => undefined);
const isGuildAdmin = mock(async () => true);

mock.module("../../src/data/guildSettings.js", () => ({
  clearGuildPrefix,
}));

mock.module("../../src/permissions.js", () => ({
  isGuildAdmin,
}));

const DEFAULT_PREFIX = normalizePrefix(process.env.COMMAND_PREFIX, "!");
let execute: (
  client: import("../../src/types/command.js").BotClient,
  message: MessageCreatePayload,
) => Promise<void>;

beforeAll(async () => {
  ({ execute } = await import("../../src/commands/resetprefix.js"));
});

beforeEach(() => {
  clearGuildPrefix.mockReset();
  isGuildAdmin.mockReset();
  isGuildAdmin.mockResolvedValue(true);
});

test("resetprefix requires a guild", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: `${DEFAULT_PREFIX}resetprefix`,
    guild_id: undefined,
  });

  await execute(client, message);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "This command can only be used in a server.",
  });
  expect(clearGuildPrefix).not.toHaveBeenCalled();
});

test("resetprefix requires admin permissions", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: `${DEFAULT_PREFIX}resetprefix`,
    guild_id: "guild-1",
  });

  isGuildAdmin.mockResolvedValueOnce(false);

  await execute(client, message);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "You need administrator permissions to reset the prefix.",
  });
  expect(clearGuildPrefix).not.toHaveBeenCalled();
});

test("resetprefix clears prefix when valid", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: `${DEFAULT_PREFIX}resetprefix`,
    guild_id: "guild-1",
  });

  await execute(client, message);

  expect(clearGuildPrefix).toHaveBeenCalledWith("guild-1", DEFAULT_PREFIX);
  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: `Prefix reset to default \`${DEFAULT_PREFIX}\`.`,
    allowed_mentions: { parse: [] },
  });
});

test("resetprefix handles storage errors", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: `${DEFAULT_PREFIX}resetprefix`,
    guild_id: "guild-1",
  });

  clearGuildPrefix.mockRejectedValueOnce(new Error("boom"));

  await execute(client, message);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Failed to reset the prefix. Please try again later.",
  });
});
