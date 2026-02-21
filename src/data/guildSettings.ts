import { prisma } from "../db/client.js";

const DEFAULT_PREFIX_CACHE_TTL_MS = 5 * 60 * 1000;
const envTtlSeconds = Number.parseInt(
  process.env.PREFIX_CACHE_TTL_SECONDS ?? "",
  10,
);
const PREFIX_CACHE_TTL_MS =
  Number.isFinite(envTtlSeconds) && envTtlSeconds > 0
    ? envTtlSeconds * 1000
    : DEFAULT_PREFIX_CACHE_TTL_MS;
const prefixCache = new Map<
  string,
  {
    value: string | null;
    expiresAt: number;
  }
>();

function getCachedPrefix(guildId: string): string | null | undefined {
  const cached = prefixCache.get(guildId);
  if (!cached) return undefined;
  if (cached.expiresAt <= Date.now()) {
    prefixCache.delete(guildId);
    return undefined;
  }
  return cached.value;
}

function setCachedPrefix(guildId: string, value: string | null): void {
  prefixCache.set(guildId, {
    value,
    expiresAt: Date.now() + PREFIX_CACHE_TTL_MS,
  });
}

export type UpsertGuildSettingsInput = {
  guildId: string;
  prefix?: string;
  locale?: string | null;
  timezone?: string | null;
};

export async function getGuildSettings(guildId: string) {
  return prisma.guildSettings.findUnique({ where: { guildId } });
}

export async function getGuildPrefix(guildId: string): Promise<string | null> {
  const cached = getCachedPrefix(guildId);
  if (cached !== undefined) return cached;

  const settings = await prisma.guildSettings.findUnique({
    where: { guildId },
    select: { prefix: true },
  });

  const prefix = settings?.prefix ?? null;
  setCachedPrefix(guildId, prefix);
  return prefix;
}

export async function upsertGuildSettings(input: UpsertGuildSettingsInput) {
  const locale = input.locale === undefined ? undefined : input.locale;
  const timezone = input.timezone === undefined ? undefined : input.timezone;
  const updates = {
    ...(input.prefix !== undefined ? { prefix: input.prefix } : {}),
    ...(locale !== undefined ? { locale } : {}),
    ...(timezone !== undefined ? { timezone } : {}),
  };

  return prisma.guildSettings.upsert({
    where: { guildId: input.guildId },
    update: updates,
    create: {
      guildId: input.guildId,
      prefix: input.prefix ?? "!",
      locale: input.locale ?? null,
      timezone: input.timezone ?? null,
    },
  });
}

export async function setGuildPrefix(guildId: string, prefix: string) {
  const settings = await upsertGuildSettings({ guildId, prefix });
  setCachedPrefix(guildId, settings.prefix);
  return settings;
}

export async function clearGuildPrefix(
  guildId: string,
  defaultPrefix: string,
): Promise<void> {
  const settings = await upsertGuildSettings({
    guildId,
    prefix: defaultPrefix,
  });
  setCachedPrefix(guildId, settings.prefix);
}
