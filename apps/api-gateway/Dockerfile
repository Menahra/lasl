FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | gpg --dearmor -o /usr/share/keyrings/doppler-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/doppler-archive-keyring.gpg] https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get -y install doppler && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ---------- Build Stage ----------
FROM base AS build
WORKDIR /usr/src/app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json biome.json ./
COPY apps ./apps
COPY packages ./packages

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter api-gateway... run build
RUN pnpm deploy --filter=api-gateway --prod /prod/api-gateway

# ---------- Runtime Stage ----------
FROM base AS api-gateway
WORKDIR /prod/api-gateway

COPY --from=build /prod/api-gateway ./
EXPOSE 3000
CMD [ "pnpm", "start" ]
