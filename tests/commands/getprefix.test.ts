import { beforeEach, expect, mock, test } from "bun:test";
import type { MessageCreatePayload } from "../../src/types/command.js";
import { createMessagePayload, createMockClient } from "../helpers.js";

const getGuildPrefix = mock(async () => "?");

mock.module("../../src/data/guildSettings.js", () => ({
  getGuildPrefix,
}));

const { execute } = await import("../../src/commands/getprefix.js");

beforeEach(() => {
  getGuildPrefix.mockReset();
  getGuildPrefix.mockResolvedValue("?");
});

test("getprefix responds with default prefix outside guild", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!getprefix",
    guild_id: undefined,
  });

  await execute(client, message);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Current prefix is `!`.",
    allowed_mentions: { parse: [] },
  });
});

test("getprefix responds with guild prefix when present", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!getprefix",
    guild_id: "guild-1",
  });

  await execute(client, message);

  expect(getGuildPrefix).toHaveBeenCalledWith("guild-1");
  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Current prefix is `?`.",
    allowed_mentions: { parse: [] },
  });
});
