import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import RegisterUseCase from '../../use-cases/register.usecase'
import PrismaUsersRepository from '../../repositories/prisma/prisma-users.repository'

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const repository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(repository)
    await registerUseCase.execute({ name, email, password })
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
