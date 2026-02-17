import type { GuildSettings } from "@prisma/client";
import { prisma } from "../db/client.js";

export type UpsertGuildSettingsInput = {
  guildId: string;
  prefix?: string;
  locale?: string | null;
  timezone?: string | null;
};

export async function getGuildSettings(
  guildId: string,
): Promise<GuildSettings | null> {
  return prisma.guildSettings.findUnique({ where: { guildId } });
}

export async function upsertGuildSettings(
  input: UpsertGuildSettingsInput,
): Promise<GuildSettings> {
  const locale = input.locale === undefined ? undefined : input.locale;
  const timezone = input.timezone === undefined ? undefined : input.timezone;

  return prisma.guildSettings.upsert({
    where: { guildId: input.guildId },
    update: {
      prefix: input.prefix,
      locale,
      timezone,
    },
    create: {
      guildId: input.guildId,
      prefix: input.prefix ?? "!",
      locale: input.locale ?? null,
      timezone: input.timezone ?? null,
    },
  });
}
