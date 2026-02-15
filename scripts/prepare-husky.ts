export {};

const isCI =
  String(process.env.CI ?? "").toLowerCase() === "true" ||
  String(process.env.CI ?? "") === "1";

const isProduction =
  String(process.env.NODE_ENV ?? "").toLowerCase() === "production";

if (isCI || isProduction) {
  process.exit(0);
}

const proc = Bun.spawn(["husky"], {
  stdout: "inherit",
  stderr: "inherit",
});

await proc.exited;
process.exit(proc.exitCode ?? 1);
