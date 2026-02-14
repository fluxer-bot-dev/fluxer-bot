# syntax=docker/dockerfile:1

FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json ./
COPY bun.lockb* bun.lock* ./
RUN bun install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src
RUN bun run build

FROM oven/bun:1-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
COPY bun.lockb* bun.lock* ./
RUN bun install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist

USER bun
CMD ["bun", "dist/index.js"]
