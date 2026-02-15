export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "unknown error";
  }
}

export function registerProcessHandlers(): {
  shouldStop: () => boolean;
  requestStop: () => void;
} {
  let shouldStop = false;

  const requestStop = () => {
    shouldStop = true;
  };

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    process.exit(1);
  });

  process.on("SIGINT", () => {
    requestStop();
    console.log("Received SIGINT, shutting down.");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    requestStop();
    console.log("Received SIGTERM, shutting down.");
    process.exit(0);
  });

  return {
    shouldStop: () => shouldStop,
    requestStop,
  };
}
