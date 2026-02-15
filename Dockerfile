FROM oven/bun:1-slim
WORKDIR /app

ENV CI=true

COPY package.json bun.lockb* bun.lock* scripts ./ 
ARG BUN_INSTALL_FLAGS="--frozen-lockfile --production"
RUN bun install ${BUN_INSTALL_FLAGS}

COPY tsconfig.json src ./

CMD ["bun", "index.ts"]
