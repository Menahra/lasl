const API_PATH_PREFIX = "/api";

export const AUTH_API_VERSIONS = {
  v1: "v1",
} as const;

// biome-ignore lint/style/useExportsLast: ok for type def
export type AuthApiVersion = keyof typeof AUTH_API_VERSIONS;

const versionPrefix = (version: AuthApiVersion) =>
  `${API_PATH_PREFIX}/${AUTH_API_VERSIONS[version]}`;

export const authApiRoutes = {
  user: {
    create: (version: AuthApiVersion = "v1") =>
      `${versionPrefix(version)}/users`,
    verify: (id: string, code: string, version: AuthApiVersion = "v1") =>
      `${versionPrefix(version)}/users/verify/${id}/${code}`,
    me: (version: AuthApiVersion = "v1") =>
      `${versionPrefix(version)}/users/me`,
  },
  session: {
    create: (version: AuthApiVersion = "v1") =>
      `${versionPrefix(version)}/sessions`,
    refresh: (version: AuthApiVersion = "v1") =>
      `${versionPrefix(version)}/sessions/refresh`,
    logout: (version: AuthApiVersion = "v1") =>
      `${versionPrefix(version)}/sessions/logout`,
  },
};
