import process from "node:process";
import { buildApiGatewayApp } from "@/src/app.ts";
import { ENVIRONMENT } from "@/src/config/environment.config.ts";

const startApiGatewayApp = async () => {
  const app = await buildApiGatewayApp();

  const { [ENVIRONMENT.port]: port } = app.config;

  try {
    await app.listen({ host: "0.0.0.0", port });
  } catch (err) {
    app.log.error(err, "Error starting api gateway server");
    process.exit(1);
  }
};

startApiGatewayApp();
