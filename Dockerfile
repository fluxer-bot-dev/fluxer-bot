FROM oven/bun:1-slim
WORKDIR /app

ENV CI=true

COPY package.json bun.lockb* bun.lock* ./
ARG BUN_INSTALL_FLAGS="--frozen-lockfile --production"
RUN bun install ${BUN_INSTALL_FLAGS}

COPY tsconfig.json ./tsconfig.json
COPY src ./src

CMD ["bun", "src/index.ts"]
