import { mock } from "bun:test";
import type { BotClient, MessageCreatePayload } from "../src/types/command.js";

type CreateMessagePayload = {
  content: string;
  allowed_mentions?: {
    parse: string[];
  };
};

type CreateMessage = (
  channelId: string,
  payload: CreateMessagePayload,
) => Promise<void>;

type MockClient = {
  api: {
    channels: {
      createMessage: CreateMessage;
    };
  };
};

export function createMockClient(): {
  client: BotClient;
  createMessage: ReturnType<typeof mock>;
} {
  const createMessage = mock(
    async (_channelId: string, _payload: CreateMessagePayload) => undefined,
  );
  const client = {
    api: {
      channels: {
        createMessage,
      },
    },
  } as MockClient;

  return { client: client as unknown as BotClient, createMessage };
}

export function createMessagePayload(
  overrides: Partial<MessageCreatePayload> = {},
): MessageCreatePayload {
  return {
    channel_id: "channel-1",
    content: "",
    author: { id: "user-1" },
    ...overrides,
  };
}
