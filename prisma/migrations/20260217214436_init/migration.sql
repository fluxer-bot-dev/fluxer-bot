-- CreateTable
CREATE TABLE "GuildSettings" (
    "guildId" TEXT NOT NULL,
    "prefix" TEXT NOT NULL DEFAULT '!',
    "locale" TEXT,
    "timezone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuildSettings_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "CommandInvocation" (
    "id" SERIAL NOT NULL,
    "command" TEXT NOT NULL,
    "guildId" TEXT,
    "channelId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommandInvocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommandInvocation_command_createdAt_idx" ON "CommandInvocation"("command", "createdAt");

-- CreateIndex
CREATE INDEX "CommandInvocation_guildId_createdAt_idx" ON "CommandInvocation"("guildId", "createdAt");
