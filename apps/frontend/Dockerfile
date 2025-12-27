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

FROM base AS build
WORKDIR /usr/src/app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json biome.json ./
COPY apps ./apps
COPY packages ./packages
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN

# Debug: Check if Doppler can list secrets
RUN doppler secrets --project frontend --config dev --token $DOPPLER_TOKEN || echo "Failed to list secrets"

# Debug: Try to get the specific secret
RUN doppler secrets get VITE_API_URL --plain --project frontend --config dev --token $DOPPLER_TOKEN || echo "Failed to get VITE_API_URL"

# Try the build with doppler run instead
RUN doppler run --project frontend --config dev --token $DOPPLER_TOKEN --command="pnpm --filter frontend run build"

FROM nginx:alpine AS frontend
COPY --from=build /usr/src/app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]