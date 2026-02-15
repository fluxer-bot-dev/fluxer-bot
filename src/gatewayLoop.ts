import type { WebSocketManager } from "@discordjs/ws";

import { formatErrorMessage } from "./process.js";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithTimeout(
  gateway: WebSocketManager,
  timeoutMs = 15_000,
) {
  let timeoutId: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`connect timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    await Promise.race([gateway.connect(), timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function runGatewayLoop(
  gateway: WebSocketManager,
  shouldStop: () => boolean,
): Promise<void> {
  let backoffMs = 2_000;
  const backoffCapMs = 60_000;

  while (!shouldStop()) {
    try {
      console.log("[gateway] connecting...");
      await connectWithTimeout(gateway);
      console.log("[gateway] connected");
      return;
    } catch (error) {
      const message = formatErrorMessage(error);
      console.error(`[gateway] connect failed: ${message}`);
      if (shouldStop()) return;

      const jitterFactor = 1 + (Math.random() * 0.4 - 0.2);
      const waitMs = Math.max(0, Math.round(backoffMs * jitterFactor));
      console.log(`[gateway] retrying in ${waitMs}ms`);
      await sleep(waitMs);

      backoffMs = Math.min(backoffCapMs, Math.round(backoffMs * 1.7));
    }
  }
}
