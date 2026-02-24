import { beforeEach, expect, mock, test } from "bun:test";
import type { MessageCreatePayload } from "../../src/types/command.js";
import { createMessagePayload, createMockClient } from "../helpers.js";

const setGuildPrefix = mock(async () => undefined);
const isGuildAdmin = mock(async () => true);

mock.module("../../src/data/guildSettings.js", () => ({
  setGuildPrefix,
}));

mock.module("../../src/permissions.js", () => ({
  isGuildAdmin,
}));

const { execute } = await import("../../src/commands/setprefix.js");

beforeEach(() => {
  setGuildPrefix.mockReset();
  isGuildAdmin.mockReset();
  isGuildAdmin.mockResolvedValue(true);
});

test("setprefix requires a guild", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!setprefix ?",
    guild_id: undefined,
  });

  await execute(client, message, ["?"]);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "This command can only be used in a server.",
  });
  expect(setGuildPrefix).not.toHaveBeenCalled();
});

test("setprefix requires admin permissions", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!setprefix ?",
    guild_id: "guild-1",
  });

  isGuildAdmin.mockResolvedValueOnce(false);

  await execute(client, message, ["?"]);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "You need administrator permissions to change the prefix.",
  });
  expect(setGuildPrefix).not.toHaveBeenCalled();
});

test("setprefix rejects prefixes with spaces", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!setprefix bad prefix",
    guild_id: "guild-1",
  });

  await execute(client, message, ["bad", "prefix"]);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Prefixes cannot contain spaces.",
  });
  expect(setGuildPrefix).not.toHaveBeenCalled();
});

test("setprefix requires a prefix value", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!setprefix",
    guild_id: "guild-1",
  });

  await execute(client, message, []);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Usage: setprefix <prefix>",
  });
  expect(setGuildPrefix).not.toHaveBeenCalled();
});

test("setprefix rejects whitespace", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!setprefix a b",
    guild_id: "guild-1",
  });

  await execute(client, message, ["a b"]);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Prefixes cannot contain whitespace.",
  });
  expect(setGuildPrefix).not.toHaveBeenCalled();
});

test("setprefix enforces max length", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!setprefix",
    guild_id: "guild-1",
  });
  const longPrefix = "x".repeat(33);

  await execute(client, message, [longPrefix]);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Prefix must be 32 characters or fewer.",
  });
  expect(setGuildPrefix).not.toHaveBeenCalled();
});

test("setprefix handles storage errors", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!setprefix ?",
    guild_id: "guild-1",
  });

  setGuildPrefix.mockRejectedValueOnce(new Error("boom"));

  await execute(client, message, ["?"]);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Failed to update the prefix. Please try again later.",
  });
});

test("setprefix updates prefix when valid", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!setprefix ?",
    guild_id: "guild-1",
  });

  await execute(client, message, ["?"]);

  expect(setGuildPrefix).toHaveBeenCalledWith("guild-1", "?");
  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Prefix updated to `?`.",
    allowed_mentions: { parse: [] },
  });
});
