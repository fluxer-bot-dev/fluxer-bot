import { expect, test } from "bun:test";
import { execute } from "../../src/commands/ping.js";
import type { MessageCreatePayload } from "../../src/types/command.js";
import { createMockClient } from "../helpers.js";

test("ping command responds with pong", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = {
    channel_id: "123",
    content: "!ping",
  };

  await execute(client, message, []);

  expect(createMessage).toHaveBeenCalledTimes(1);
  expect(createMessage).toHaveBeenCalledWith("123", { content: "pong" });
});
