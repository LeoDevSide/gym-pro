import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import UserAlreadyExistsError from '../../use-cases/errors/user-already-exists.error'
import RegisterUseCaseFactory from '../../use-cases/factories/register.usecase.factory'

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
    const registerUseCase = RegisterUseCaseFactory.create()
    await registerUseCase.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }

  return reply.status(201).send()
}
