import fastify from "fastify";
import { appRoutes } from "./http/rotes";
import { ZodError } from "zod";
import { env } from "./env";

export const app = fastify();

app.register(appRoutes)

app.setErrorHandler((error, _request, reply)=> {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'validation error', issues: error.format()
    })
  }

  if(env.NODE_ENV !== "production") {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/newRelic/Sentry
  }

  return reply.status(500).send({
    message: 'internal server error'
  })
})
