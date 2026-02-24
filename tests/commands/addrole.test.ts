import { beforeEach, expect, mock, test } from "bun:test";
import { execute } from "../../src/commands/addrole.js";
import type {
  BotClient,
  MessageCreatePayload,
} from "../../src/types/command.js";
import { createMessagePayload } from "../helpers.js";

type Role = {
  id: string;
  name: string;
  permissions?: string | number | bigint;
};

function createAddRoleClient() {
  const createMessage = mock(async () => undefined);
  const getRoles = mock(async () => [] as Role[]);
  const addRoleToMember = mock(async () => undefined);

  const client = {
    api: {
      channels: { createMessage },
      guilds: { getRoles, addRoleToMember },
    },
  } as unknown as BotClient;

  return { client, createMessage, getRoles, addRoleToMember };
}

beforeEach(() => {
  mock.clearAllMocks();
});

test("addrole requires a guild", async () => {
  const { client, createMessage, getRoles } = createAddRoleClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!addrole <@123> Admin",
    guild_id: undefined,
  });

  await execute(client, message, ["<@123>", "Admin"]);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "This command can only be used in a server.",
  });
  expect(getRoles).not.toHaveBeenCalled();
});

test("addrole requires a mention and role name", async () => {
  const { client, createMessage } = createAddRoleClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!addrole",
    guild_id: "guild-1",
  });

  await execute(client, message, []);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Usage: !addrole @user <roleName>",
  });
});

test("addrole handles role fetch failure", async () => {
  const { client, createMessage, getRoles } = createAddRoleClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!addrole <@123> Admin",
    guild_id: "guild-1",
  });

  getRoles.mockRejectedValueOnce(new Error("boom"));

  await execute(client, message, ["<@123>", "Admin"]);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Failed to fetch roles. Please try again later.",
  });
});

test("addrole responds when role is missing", async () => {
  const { client, createMessage, getRoles } = createAddRoleClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!addrole <@123> Admin",
    guild_id: "guild-1",
  });

  getRoles.mockResolvedValueOnce([{ id: "1", name: "Member" }]);

  await execute(client, message, ["<@123>", "Admin"]);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: 'Could not find role "Admin"',
  });
});

test("addrole adds a role when found", async () => {
  const { client, createMessage, getRoles, addRoleToMember } =
    createAddRoleClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!addrole <@123> Admin",
    guild_id: "guild-1",
  });

  getRoles.mockResolvedValueOnce([{ id: "99", name: "Admin" }]);

  await execute(client, message, ["<@123>", "Admin"]);

  expect(addRoleToMember).toHaveBeenCalledWith("guild-1", "123", "99");
  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: 'Added role "Admin" to <@123>!',
  });
});

test("addrole reports failure to add role", async () => {
  const { client, createMessage, getRoles, addRoleToMember } =
    createAddRoleClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!addrole <@123> Admin",
    guild_id: "guild-1",
  });

  getRoles.mockResolvedValueOnce([{ id: "99", name: "Admin" }]);
  addRoleToMember.mockRejectedValueOnce(new Error("boom"));

  await execute(client, message, ["<@123>", "Admin"]);

  expect(createMessage).toHaveBeenCalledWith("channel-1", {
    content: "Failed to add the role. Please check permissions.",
  });
});
