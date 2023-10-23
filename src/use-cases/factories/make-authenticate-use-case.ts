import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { RegisterUseCase } from "../register"
import { AuthenticateUseCase } from "../authenticate"

export function makeAuthenticateUseCase() {
  const UserRepository = new PrismaUserRepository()
  const authenticateUseCase = new AuthenticateUseCase(UserRepository)

  return authenticateUseCase
}