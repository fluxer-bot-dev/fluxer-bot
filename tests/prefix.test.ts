import { describe, expect, test } from "bun:test";
import { normalizePrefix } from "../src/prefix.js";

describe("normalizePrefix", () => {
  test("returns fallback when undefined", () => {
    expect(normalizePrefix(undefined, "!")).toBe("!");
  });

  test("returns fallback when empty or whitespace", () => {
    expect(normalizePrefix("", "!")).toBe("!");
    expect(normalizePrefix("   ", "!")).toBe("!");
  });

  test("returns fallback when prefix contains whitespace", () => {
    expect(normalizePrefix("! ping", "!")).toBe("!");
  });

  test("returns value when valid", () => {
    expect(normalizePrefix("?", "!")).toBe("?");
  });
});
