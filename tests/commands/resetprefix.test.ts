import { beforeEach, expect, mock, test } from "bun:test";
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

const { execute } = await import("../../src/commands/resetprefix.js");

beforeEach(() => {
  clearGuildPrefix.mockReset();
  isGuildAdmin.mockReset();
  isGuildAdmin.mockResolvedValue(true);
});

test("resetprefix requires a guild", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!resetprefix",
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
    content: "!resetprefix",
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
    content: "!resetprefix",
    guild_id: "guild-1",
  });

  await execute(client, message);

  expect(clearGuildPrefix).toHaveBeenCalledWith("guild-1", "!");
  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Prefix reset to default `!`.",
    allowed_mentions: { parse: [] },
  });
});

test("resetprefix handles storage errors", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!resetprefix",
    guild_id: "guild-1",
  });

  clearGuildPrefix.mockRejectedValueOnce(new Error("boom"));

  await execute(client, message);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Failed to reset the prefix. Please try again later.",
  });
});
