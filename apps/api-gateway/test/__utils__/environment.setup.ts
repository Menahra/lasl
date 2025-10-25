import { vi } from "vitest";
import { ENVIRONMENT } from "@/src/config/environment.config.ts";

vi.stubEnv(ENVIRONMENT.port, "3000");
vi.stubEnv(ENVIRONMENT.applicationHostPort, "8080");
vi.stubEnv(ENVIRONMENT.authenticationServiceUrl, "http://localhost:3001");
