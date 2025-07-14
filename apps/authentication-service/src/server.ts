import { buildApp } from "./app.ts";

const startAuthenticationServer = async () => {
  const app = await buildApp();

  const { PORT } = app.config;

  try {
    await app.listen({ port: PORT });
  } catch (err) {
    app.log.error("Error starting server:", err);
    process.exit(1);
  }
};

startAuthenticationServer();
