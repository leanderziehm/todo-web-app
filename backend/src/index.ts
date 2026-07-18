import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import path from "path";
import { fileURLToPath } from "url";
import autoload from "@fastify/autoload";
import cors from '@fastify/cors'
import {validateEnv} from "./env.js";

const version = "0.0.4";


validateEnv();

// const envToLogger:any = {
//   development: {
//     transport: {
//       target: 'pino-pretty',
//       options: {
//         translateTime: 'HH:MM:ss Z',
//         ignore: 'pid,hostname',
//       },
//     },
//   },
//   production: true,
//   test: false,
// }

// const app = fastify.fastify({ logger: envToLogger["development"] ?? true  });
const app = fastify.fastify({ logger: true  });

await app.register(cors, {
   origin: true
})


process.on("uncaughtException", (err: Error) => {
  app.log.error(`Uncaught Exception: ${err}` );
});

process.on("unhandledRejection", (reason, promise) => {
   app.log.error(`Unhandled Rejection at: ${promise}  reason: ${reason}` );
});
// Global error handler
app.setErrorHandler((error, request, reply) => {
  // Log the error
  app.log.error(`Global error handler: ${error}` );

  // Send a generic response to the client
  reply.status(500).send({ error: "Internal Server Error" });
});

const swaggerOptions = {
  swagger: {
    info: {
      title: "Tracker",
      description:
        "This app lets you track personal data like notes, time tracking, nutrient and medication intake, etc.",
      version: version,
    },
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

app.register(fastifySwagger, swaggerOptions);
app.register(fastifySwaggerUi, swaggerUiOptions);

const __dirname = path.dirname(fileURLToPath(import.meta.url)); //const __filename = fileURLToPath(import.meta.url);

app.register(autoload, {
  dir: path.join(__dirname, "routes"),
  forceESM: true,
});

app.get("/", async (request, reply) => {
  reply.redirect("/docs",302);
});

// app.get("/favicon.ico", async () => {
//   return ``; // host static file image.png from public 
// });

// export default async function (app) {
//   app.register(fastifyStatic, {
//     root: path.join(__dirname, "../public"),
//     prefix: "/", // serves files at /
//   });
// }


////


// app
//   .listen({ port: 4000, host: "0.0.0.0" })
//   .then(() => 1)
//   .catch((err) => {
//     // console.error(err);
//       app.log.error(`Error: ${err}` );

//     process.exit(1);
//   });



const start = async () => {
  try {
    await app.listen({ port: 4000, host: "0.0.0.0" });
    app.log.info("Server started");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

const shutdown = async (signal: string) => {
  app.log.info(`${signal} received, shutting down`);

  try {
    await app.close();
    app.log.info("Fastify closed successfully");
    process.exit(0);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

await start();