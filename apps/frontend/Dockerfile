FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install Doppler CLI and system dependencies
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | gpg --dearmor -o /usr/share/keyrings/doppler-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/doppler-archive-keyring.gpg] https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get -y install doppler && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 2. Pruner Stage: Isolate Frontend dependencies
FROM base AS pruner
WORKDIR /usr/src/app
RUN pnpm add -g turbo
COPY . .
# Note: Using the package name 'frontend' as per your earlier filter
RUN turbo prune frontend --docker

# 3. Build Stage: Compile the static assets
FROM base AS build
WORKDIR /usr/src/app

# Copy pruned lockfile and package.json
COPY --from=pruner /usr/src/app/out/json/ .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

# Copy pruned source and the critical root configs
COPY --from=pruner /usr/src/app/out/full/ .
COPY tsconfig.base.json biome.json ./

# Inject Doppler Token for build-time environment variables
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN

# Build via Doppler to ensure variables are baked into the JS bundles
RUN doppler run -- pnpm turbo run build --filter=frontend

# 4. Runtime Stage: Serve with Nginx
FROM nginx:alpine AS frontend

# Copy the built assets from the build stage
# The path inside the pruned workspace will be apps/frontend/dist
COPY --from=build /usr/src/app/apps/frontend/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
