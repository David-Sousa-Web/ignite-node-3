import fastify from "fastify";
import { appRoutes } from "./http/rotes";

export const app = fastify();

app.register(appRoutes)
