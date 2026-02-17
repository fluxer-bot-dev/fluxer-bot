export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "unknown error";
  }
}

export function registerProcessHandlers(
  onShutdown?: () => Promise<void> | void,
): {
  shouldStop: () => boolean;
  requestStop: () => void;
} {
  let shouldStop = false;

  const requestStop = () => {
    shouldStop = true;
  };

  const shutdown = async (exitCode: number, reason: string) => {
    requestStop();
    console.log(reason);

    if (onShutdown) {
      try {
        await onShutdown();
      } catch (error) {
        console.error("Shutdown error:", error);
      }
    }

    process.exit(exitCode);
  };

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    void shutdown(1, "Shutting down after uncaught exception.");
  });

  process.on("SIGINT", () => {
    void shutdown(0, "Received SIGINT, shutting down.");
  });

  process.on("SIGTERM", () => {
    void shutdown(0, "Received SIGTERM, shutting down.");
  });

  return {
    shouldStop: () => shouldStop,
    requestStop,
  };
}
