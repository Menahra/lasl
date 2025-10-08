import { inject, vi } from "vitest";
import { ENVIRONMENT } from "@/src/config/environment.ts";

vi.stubEnv(ENVIRONMENT.jwtAccessPrivateKey, "123AccessPrivate");
vi.stubEnv(ENVIRONMENT.jwtAccessPublicKey, "123AccessPublic");
vi.stubEnv(ENVIRONMENT.jwtRefreshPrivateKey, "123RefreshPrivate");
vi.stubEnv(ENVIRONMENT.jwtRefreshPublicKey, "123RefreshPublic");
vi.stubEnv(ENVIRONMENT.port, "3000");
vi.stubEnv(ENVIRONMENT.applicationHostPort, "8080");
vi.stubEnv(ENVIRONMENT.mongoUri, inject("MONGO_DB_URI"));
vi.stubEnv(ENVIRONMENT.resendApiKey, "some_api_key");
