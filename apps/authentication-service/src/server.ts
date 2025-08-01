import { buildApp } from "./app.js";

const startAuthenticationServer = async () => {
  const app = await buildApp();

  const { PORT } = app.config;

  try {
    await app.listen({ host: "0.0.0.0", port: PORT });
  } catch (err) {
    app.log.error("Error starting server:", err);
    process.exit(1);
  }
};

startAuthenticationServer();
