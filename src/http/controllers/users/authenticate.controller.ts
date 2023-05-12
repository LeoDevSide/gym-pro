import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import AuthUseCaseFactory from '../../../use-cases/factories/authenticate.usecase.factory'
import InvalidCredentialsError from '../../../use-cases/errors/invalid-credentials.error'

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = registerBodySchema.parse(request.body)

  try {
    const authUseCase = AuthUseCaseFactory.create()

    const { user } = await authUseCase.execute({ email, password })
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )
    return reply.status(200).send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
