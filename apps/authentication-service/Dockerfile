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

# Pruner Stage: Use Turbo to extract the Auth Service graph
FROM base AS pruner
WORKDIR /usr/src/app
RUN pnpm add -g turbo
COPY . .
# We use the scoped name here
RUN turbo prune @lasl/authentication-service --docker

# Build Stage: Install, Copy Configs, and Compile
FROM base AS build
WORKDIR /usr/src/app

# Copy pruned lockfile and package.json files
COPY --from=pruner /usr/src/app/out/json/ .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the actual source code
COPY --from=pruner /usr/src/app/out/full/ .

# Critical: Manually copy root configs for TypeScript inheritance
COPY tsconfig.base.json biome.json ./

# Run the build for auth and its local workspace dependencies
RUN pnpm turbo run build --filter=@lasl/authentication-service...

# Isolated production-ready folder (removes devDeps and unnecessary workspace files)
RUN pnpm deploy --filter=@lasl/authentication-service --prod /prod/authentication-service

# Runtime Stage: Final Node execution environment
FROM base AS authentication-service
WORKDIR /prod/authentication-service

# Copy only the deployed production folder from the build stage
COPY --from=build /prod/authentication-service ./

EXPOSE 3000
CMD [ "pnpm", "start" ]
