import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { authenticate } from "./controllers/authenticate";
import { VerifyJwt } from "./middlewares/verify-jwt";
import { profile } from "./controllers/profile";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  //auth
  app.get("/me", { onRequest: [VerifyJwt] }, profile);
}
