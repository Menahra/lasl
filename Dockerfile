FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=authentication-service --prod /prod/authentication-service

FROM base AS authentication-service
COPY --from=build /prod/authentication-service /prod/authentication-service
WORKDIR /prod/authentication-service
EXPOSE 3000
CMD [ "pnpm", "start" ]
