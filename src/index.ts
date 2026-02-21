import { assertTokenPresent } from "./bootstrap.js";
import { BOT_TOKEN } from "./config.js";
import { connectDb, disconnectDb } from "./db/client.js";
import { createFluxerClient } from "./fluxerClient.js";
import { runGatewayLoop } from "./gatewayLoop.js";
import { registerHandlers } from "./handlers.js";
import { registerProcessHandlers } from "./process.js";

async function main() {
  const token = assertTokenPresent(BOT_TOKEN);
  const { gateway, client } = createFluxerClient(token);
  await connectDb();
  await registerHandlers(client);

  const { shouldStop } = registerProcessHandlers(disconnectDb);
  await runGatewayLoop(gateway, shouldStop);
}

main().catch((error) => {
  console.error("Failed to start bot:", error);
  process.exit(1);
});
