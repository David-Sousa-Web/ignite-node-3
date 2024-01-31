import { FastifyReply, FastifyRequest } from "fastify";

export async function VerifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.status(401).send({ mesage: "Unauthorized." });
  }
}
