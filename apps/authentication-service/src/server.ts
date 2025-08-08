import { buildApp } from "./app.ts";
import { ENVIRONMENT } from "./config/constants.ts";

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

// next steps:

// postman api collection
// add check in github action that build works for docker image!!!
// add jsdoc annotations for swagger docu?

// starting with first real endpoints
// after each endpoint add tests
// also with postman
