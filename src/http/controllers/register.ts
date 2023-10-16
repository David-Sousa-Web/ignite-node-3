import {FastifyRequest, FastifyReply} from 'fastify'
import { hash } from 'bcryptjs'
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistError } from '@/use-cases/errors/user-already-exists'

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
        const prismaUserRepository = new PrismaUserRepository()
        const registerUseCase = new RegisterUseCase(prismaUserRepository)
        
        await registerUseCase.execute({
            name,
            email,
            password
        })
    } catch(err) {
        if(err instanceof UserAlreadyExistError) {
            return reply.status(409).send({
                message: err.message
            })
        }

        throw err
    }

    return reply.status(201).send()
}