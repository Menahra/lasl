import process from "node:process";
import { buildApp } from "./app.ts";
import { ENVIRONMENT } from "./config/environment.ts";

const startAuthenticationServer = async () => {
  const app = await buildApp();

  const { [ENVIRONMENT.port]: port } = app.config;

  try {
    await app.listen({ host: "0.0.0.0", port });
  } catch (err) {
    app.log.error("Error starting server:", err);
    process.exit(1);
  }
};

startAuthenticationServer();
