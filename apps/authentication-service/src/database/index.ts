import type { FastifyInstance } from "fastify";
import mongoose from "mongoose";

export const connectToMongoDb = async (fastifyInstance: FastifyInstance) => {
  const { MONGO_URI } = fastifyInstance.config;

  try {
    fastifyInstance.log.info(
      // biome-ignore lint/performance/useTopLevelRegex: not called frequently
      `Attempting to connect to: ${MONGO_URI.replace(/:[^:]*@/, ":*****@")}`,
    );
    await mongoose.connect(MONGO_URI);
    fastifyInstance.log.info("MongoDB connected successfully!");

    mongoose.connection.on("error", (err) => {
      fastifyInstance.log.error("Mongoose connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      fastifyInstance.log.warn("Mongoose disconnected from DB");
    });
  } catch (error) {
    fastifyInstance.log.error("MongoDB connection failed:", error);
    throw error;
  }
};
