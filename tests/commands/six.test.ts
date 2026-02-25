import { expect, test } from "bun:test";
import { execute } from "../../src/commands/6.js";
import type { MessageCreatePayload } from "../../src/types/command.js";
import { createMessagePayload, createMockClient } from "../helpers.js";

test("6 command responds with 7", async () => {
  const { client, createMessage } = createMockClient();
  const message: MessageCreatePayload = createMessagePayload({
    content: "!6",
  });

  await execute(client, message, []);

  expect(createMessage).toHaveBeenCalledWith("channel-1", { content: "7" });
});
