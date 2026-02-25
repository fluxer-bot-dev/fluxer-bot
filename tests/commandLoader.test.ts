import { expect, mock, test } from "bun:test";
import { loadCommands } from "../src/commandLoader.js";

const getGuildPrefix = mock(async () => null);
const setGuildPrefix = mock(async () => undefined);
const clearGuildPrefix = mock(async () => undefined);
const isGuildAdmin = mock(async () => true);

mock.module("../src/data/guildSettings.js", () => ({
  getGuildPrefix,
  setGuildPrefix,
  clearGuildPrefix,
}));

mock.module("../src/permissions.js", () => ({
  isGuildAdmin,
}));

test("loadCommands loads known commands", async () => {
  const commands = await loadCommands();

  expect(commands.has("ping")).toBe(true);
  expect(commands.has("getprefix")).toBe(true);
  expect(commands.has("setprefix")).toBe(true);
  expect(commands.has("resetprefix")).toBe(true);
  expect(commands.has("addrole")).toBe(true);

  const pingCommand = commands.get("ping");
  expect(typeof pingCommand?.execute).toBe("function");
});
