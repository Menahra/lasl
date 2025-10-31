/** biome-ignore-all lint/security/noSecrets: just mock data */
import { vi } from "vitest";
import { ENVIRONMENT } from "@/src/config/environment.ts";

vi.stubEnv(ENVIRONMENT.jwtAccessPrivateKey, "123AccessPrivate");
vi.stubEnv(ENVIRONMENT.jwtAccessPublicKey, "123AccessPublic");
vi.stubEnv(ENVIRONMENT.jwtRefreshPrivateKey, "123RefreshPrivate");
vi.stubEnv(ENVIRONMENT.jwtRefreshPublicKey, "123RefreshPublic");
vi.stubEnv(ENVIRONMENT.port, "3000");
vi.stubEnv(ENVIRONMENT.applicationHostPort, "8080");
// mongo uri might be overridden by fastify setup
vi.stubEnv(ENVIRONMENT.mongoUri, "MONGO_DB_URI");
vi.stubEnv(ENVIRONMENT.resendApiKey, "some_api_key");
