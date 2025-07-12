import process from "node:process";
import Fastify from "fastify";

const fastify = Fastify();

// biome-ignore lint/complexity/useLiteralKeys: have to use bracket notation for process.env
const applicationPort = Number(process.env["PORT"]);

fastify.listen({ port: applicationPort }, (error, address) => {
	if (error) {
		process.exit(1);
	}

	console.log(`Authentication App is running at ${address}`);
});
